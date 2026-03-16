import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import pool from '$lib/server/db';
import { supabase } from '$lib/server/supabase';
import { verifyJwt } from '$lib/server/jwt';
import { JWT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async () => {
	const [rows] = await pool.execute(
		'SELECT document_id, name, template_path, template_name, requirements, upload_date FROM documents ORDER BY upload_date DESC'
	);
	return json(rows);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('session');
	if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

	let payload: { userId: number; role: string };
	try {
		payload = verifyJwt<{ userId: number; role: string }>(token, JWT_SECRET);
	} catch {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (payload.role === 'Student') return json({ error: 'Forbidden' }, { status: 403 });

	const formData = await request.formData();
	const name = formData.get('name') as string;
	const requirementsJson = formData.get('requirements') as string;
	const templateFile = formData.get('template') as File | null;

	if (!name || !requirementsJson) return json({ error: 'Missing fields' }, { status: 400 });

	let templatePath: string | null = null;
	let templateName: string | null = null;

	if (templateFile && templateFile.size > 0) {
		const ext = templateFile.name.split('.').pop();
		const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
		const buffer = Buffer.from(await templateFile.arrayBuffer());
		const { error } = await supabase.storage.from('templates').upload(path, buffer, {
			contentType: templateFile.type
		});
		if (error) return json({ error: `Upload failed: ${error.message}` }, { status: 500 });
		templatePath = path;
		templateName = templateFile.name;
	}

	const [result] = await pool.execute(
		'INSERT INTO documents (name, template_path, template_name, requirements, uploaded_by) VALUES (?, ?, ?, ?, ?)',
		[name, templatePath, templateName, requirementsJson, payload.userId]
	);

	return json({ success: true, document_id: (result as { insertId: number }).insertId });
};

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('session');
	if (!token) return json({ error: 'Unauthorized' }, { status: 401 });
	let payload: { userId: number; role: string };
	try {
		payload = verifyJwt<{ userId: number; role: string }>(token, JWT_SECRET);
	} catch {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	if (payload.role === 'Student') return json({ error: 'Forbidden' }, { status: 403 });

	const formData = await request.formData();
	const documentId = formData.get('document_id') as string;
	const name = formData.get('name') as string;
	const requirementsJson = formData.get('requirements') as string;
	const templateFile = formData.get('template') as File | null;
	const removeTemplate = formData.get('remove_template') === 'true';

	if (!documentId || !name || !requirementsJson) return json({ error: 'Missing fields' }, { status: 400 });

	// Fetch current template path
	const [rows] = await pool.execute('SELECT template_path FROM documents WHERE document_id = ?', [documentId]);
	const docs = rows as { template_path: string | null }[];
	if (docs.length === 0) return json({ error: 'Not found' }, { status: 404 });
	let templatePath = docs[0].template_path;
	let templateName: string | null = null;

	// Fetch current template name
	const [nameRows] = await pool.execute('SELECT template_name FROM documents WHERE document_id = ?', [documentId]);
	templateName = ((nameRows as { template_name: string | null }[])[0])?.template_name ?? null;

	if (removeTemplate && templatePath) {
		await supabase.storage.from('templates').remove([templatePath]);
		templatePath = null;
		templateName = null;
	}

	if (templateFile && templateFile.size > 0) {
		if (templatePath) await supabase.storage.from('templates').remove([templatePath]);
		const ext = templateFile.name.split('.').pop();
		const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
		const buffer = Buffer.from(await templateFile.arrayBuffer());
		const { error } = await supabase.storage.from('templates').upload(path, buffer, { contentType: templateFile.type });
		if (!error) { templatePath = path; templateName = templateFile.name; }
	}

	await pool.execute(
		'UPDATE documents SET name = ?, requirements = ?, template_path = ?, template_name = ? WHERE document_id = ?',
		[name, requirementsJson, templatePath, templateName, documentId]
	);

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('session');
	if (!token) return json({ error: 'Unauthorized' }, { status: 401 });
	try {
		const p = verifyJwt<{ role: string }>(token, JWT_SECRET);
		if (p.role === 'Student') return json({ error: 'Forbidden' }, { status: 403 });
	} catch {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { document_id } = await request.json();
	const [rows] = await pool.execute('SELECT template_path FROM documents WHERE document_id = ?', [document_id]);
	const docs = rows as { template_path: string | null }[];
	if (docs.length === 0) return json({ error: 'Not found' }, { status: 404 });

	if (docs[0].template_path) {
		await supabase.storage.from('templates').remove([docs[0].template_path]);
	}

	await pool.execute('DELETE FROM documents WHERE document_id = ?', [document_id]);
	return json({ success: true });
};
