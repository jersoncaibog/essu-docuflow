import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import pool from '$lib/server/db';
import { verifyJwt } from '$lib/server/jwt';
import { JWT_SECRET } from '$env/static/private';

export const load: PageServerLoad = async ({ cookies }) => {
	const token = cookies.get('session');
	if (!token) redirect(302, '/login');
	try {
		const p = verifyJwt<{ userId: number; role: string }>(token, JWT_SECRET);
		if (p.role === 'Student') redirect(302, '/student/dashboard');
	} catch { redirect(302, '/login'); }

	const [rows] = await pool.execute(
		`SELECT d.document_id, d.name, d.template_path, d.template_name,
		        d.requirements, d.upload_date,
		        CONCAT(u.first_name, ' ', u.last_name) AS uploaded_by_name
		 FROM documents d
		 JOIN users u ON d.uploaded_by = u.user_id
		 ORDER BY d.upload_date DESC`
	);

	return { documents: rows as Record<string, unknown>[] };
};
