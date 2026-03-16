import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import pool from '$lib/server/db';
import { supabase } from '$lib/server/supabase';
import { verifyJwt } from '$lib/server/jwt';
import { JWT_SECRET, RESEND_API } from '$env/static/private';
import { Resend } from 'resend';

const resend = new Resend(RESEND_API);

export const GET: RequestHandler = async ({ params, cookies }) => {
	const token = cookies.get('session');
	if (!token) return json({ error: 'Unauthorized' }, { status: 401 });
	let payload: { userId: number; role: string };
	try {
		payload = verifyJwt<{ userId: number; role: string }>(token, JWT_SECRET);
	} catch {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const [rows] = await pool.execute(
		`SELECT r.*, d.name AS document_name,
		        u.first_name, u.middle_name, u.last_name, u.student_id AS student_code,
		        u.program, u.student_type, u.email AS student_email
		 FROM requests r
		 JOIN documents d ON r.document_id = d.document_id
		 JOIN users u ON r.student_id = u.user_id
		 WHERE r.request_id = ?`,
		[params.id]
	);
	const list = rows as Record<string, unknown>[];
	if (list.length === 0) return json({ error: 'Not found' }, { status: 404 });

	const req = list[0];

	// Get status history
	const [histRows] = await pool.execute(
		`SELECT h.old_status, h.new_status, h.changed_at,
		        u.first_name, u.last_name
		 FROM request_status_history h
		 LEFT JOIN users u ON h.changed_by = u.user_id
		 WHERE h.request_id = ?
		 ORDER BY h.changed_at ASC`,
		[params.id]
	);

	return json({ ...req, history: histRows });
};

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
	const token = cookies.get('session');
	if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

	let payload: { userId: number; role: string };
	try {
		payload = verifyJwt<{ userId: number; role: string }>(token, JWT_SECRET);
	} catch {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	// Get current request
	const [rows] = await pool.execute(
		`SELECT r.*, u.email AS student_email,
		        CONCAT(u.first_name, ' ', u.last_name) AS student_name,
		        d.name AS document_name
		 FROM requests r
		 JOIN users u ON r.student_id = u.user_id
		 JOIN documents d ON r.document_id = d.document_id
		 WHERE r.request_id = ?`,
		[params.id]
	);
	const list = rows as Record<string, unknown>[];
	if (list.length === 0) return json({ error: 'Not found' }, { status: 404 });
	const currentReq = list[0];
	const oldStatus = currentReq.status as string;

	const contentType = request.headers.get('content-type') ?? '';
	let action: string, adminMessage: string | null, flaggedRequirements: string[] | null;
	let approvedFile: File | null = null;

	if (contentType.includes('multipart/form-data')) {
		const formData = await request.formData();
		action = formData.get('action') as string;
		adminMessage = formData.get('admin_message') as string || null;
		const flagged = formData.get('flagged_requirements') as string;
		flaggedRequirements = flagged ? JSON.parse(flagged) : null;
		approvedFile = formData.get('approved_file') as File | null;
	} else {
		const body = await request.json();
		action = body.action;
		adminMessage = body.admin_message ?? null;
		flaggedRequirements = body.flagged_requirements ?? null;
	}

	let newStatus: string;
	let approvedFilePath: string | null = null;
	let approvedFileName: string | null = null;

	if (action === 'approve') {
		newStatus = 'Approved';
		if (approvedFile && approvedFile.size > 0) {
			const ext = approvedFile.name.split('.').pop();
			const path = `${params.id}/approved-${Date.now()}.${ext}`;
			const buffer = Buffer.from(await approvedFile.arrayBuffer());
			const { error } = await supabase.storage.from('requirements').upload(path, buffer, {
				contentType: approvedFile.type
			});
			if (!error) {
				approvedFilePath = path;
				approvedFileName = approvedFile.name;
			}
		}
	} else if (action === 'reject') {
		newStatus = 'Rejected';
	} else if (action === 'correction') {
		newStatus = 'Correction Requested';
		// Flag specific requirements
		if (flaggedRequirements && currentReq.requirements) {
			const reqs = JSON.parse(currentReq.requirements as string);
			for (const r of reqs) {
				r.needs_correction = flaggedRequirements.includes(r.name);
			}
			await pool.execute('UPDATE requests SET requirements = ? WHERE request_id = ?', [
				JSON.stringify(reqs), params.id
			]);
		}
	} else {
		return json({ error: 'Invalid action' }, { status: 400 });
	}

	// Update request
	await pool.execute(
		`UPDATE requests SET status = ?, admin_message = ?,
		 approved_file_path = COALESCE(?, approved_file_path),
		 approved_file_name = COALESCE(?, approved_file_name)
		 WHERE request_id = ?`,
		[newStatus, adminMessage, approvedFilePath, approvedFileName, params.id]
	);

	// Record history
	await pool.execute(
		'INSERT INTO request_status_history (request_id, old_status, new_status, changed_by) VALUES (?, ?, ?, ?)',
		[params.id, oldStatus, newStatus, payload.userId]
	);

	// Send email
	const studentEmail = currentReq.student_email as string;
	const studentName = currentReq.student_name as string;
	const documentName = currentReq.document_name as string;

	let emailSubject = '';
	let emailHtml = '';

	if (action === 'approve' && approvedFilePath) {
		const { data: signedData } = await supabase.storage
			.from('requirements')
			.createSignedUrl(approvedFilePath, 604800); // 7 days
		const downloadUrl = signedData?.signedUrl ?? '';
		emailSubject = `Your request for ${documentName} has been approved`;
		emailHtml = `
			<p>Dear ${studentName},</p>
			<p>Your document request (<strong>${params.id}</strong>) for <strong>${documentName}</strong> has been <strong style="color:green">approved</strong>.</p>
			${adminMessage ? `<p>Note from staff: ${adminMessage}</p>` : ''}
			<p><a href="${downloadUrl}" style="background:#2d6a4f;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block;margin-top:10px">Download Your Document</a></p>
			<p style="color:#888;font-size:12px">This download link expires in 7 days.</p>
			<p>ESSU DocuFlow — Registrar's Office</p>`;
	} else if (action === 'reject') {
		emailSubject = `Your request for ${documentName} was rejected`;
		emailHtml = `
			<p>Dear ${studentName},</p>
			<p>Your document request (<strong>${params.id}</strong>) for <strong>${documentName}</strong> has been <strong style="color:red">rejected</strong>.</p>
			${adminMessage ? `<p>Reason: ${adminMessage}</p>` : ''}
			<p>If you have questions, please contact the Registrar's Office.</p>
			<p>ESSU DocuFlow — Registrar's Office</p>`;
	} else if (action === 'correction') {
		emailSubject = `Corrections needed for your request ${params.id}`;
		emailHtml = `
			<p>Dear ${studentName},</p>
			<p>Your document request (<strong>${params.id}</strong>) for <strong>${documentName}</strong> requires corrections.</p>
			${adminMessage ? `<p>Message from staff: ${adminMessage}</p>` : ''}
			${flaggedRequirements?.length ? `<p>Please re-submit the following requirements: <strong>${flaggedRequirements.join(', ')}</strong></p>` : ''}
			<p>Please log in to ESSU DocuFlow to re-upload the required documents.</p>
			<p>ESSU DocuFlow — Registrar's Office</p>`;
	}

	if (emailSubject) {
		await resend.emails.send({
			from: 'ESSU DocuFlow <noreply@jersondev.com>',
			to: studentEmail,
			subject: emailSubject,
			html: emailHtml
		});
	}

	return json({ success: true, new_status: newStatus });
};
