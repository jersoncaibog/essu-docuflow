import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pool from '$lib/server/db';
import { verifyJwt } from '$lib/server/jwt';
import { JWT_SECRET } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('session');
	if (!token) redirect(302, '/login');

	let payload: { userId: number; role: string };
	try {
		payload = verifyJwt<{ userId: number; role: string }>(token, JWT_SECRET);
	} catch { redirect(302, '/login'); }
	if (payload!.role !== 'Student') redirect(302, '/staff/dashboard');

	const [rows] = await pool.execute(
		`SELECT r.request_id, d.name AS document_name, r.purpose, r.status,
		        r.admin_message, r.approved_file_path, r.approved_file_name,
		        r.requirements, r.date_requested
		 FROM requests r
		 JOIN documents d ON r.document_id = d.document_id
		 WHERE r.student_id = ?
		 ORDER BY r.date_requested DESC`,
		[payload!.userId]
	);

	return { requests: rows as Record<string, unknown>[] };
};
