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
		`SELECT user_id, first_name, middle_name, last_name, suffix, email,
		        student_id, program, student_type, last_school_year, verified, date_registered
		 FROM users
		 WHERE role = 'Student'
		 ORDER BY last_name ASC`
	);

	return { students: rows };
};
