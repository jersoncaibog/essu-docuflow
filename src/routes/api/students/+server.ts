import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import pool from '$lib/server/db';
import { verifyJwt } from '$lib/server/jwt';
import { JWT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('session');
	if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

	let payload: { userId: number; role: string };
	try {
		payload = verifyJwt<{ userId: number; role: string }>(token, JWT_SECRET);
	} catch {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (payload.role === 'Student') return json({ error: 'Forbidden' }, { status: 403 });

	const [rows] = await pool.execute(
		`SELECT user_id, first_name, middle_name, last_name, suffix, email,
		        student_id, program, student_type, last_school_year, verified, date_registered
		 FROM users
		 WHERE role = 'Student'
		 ORDER BY last_name ASC`
	);

	return json(rows);
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

	const body = await request.json();
	const {
		user_id, first_name, middle_name, last_name, suffix,
		email, student_id, program, student_type, last_school_year, verified
	} = body;

	await pool.execute(
		`UPDATE users
		 SET first_name = ?, middle_name = ?, last_name = ?, suffix = ?,
		     email = ?, student_id = ?, program = ?, student_type = ?,
		     last_school_year = ?, verified = ?
		 WHERE user_id = ? AND role = 'Student'`,
		[first_name, middle_name ?? null, last_name, suffix ?? null,
		 email, student_id ?? null, program ?? null, student_type ?? null,
		 last_school_year ?? null, verified ? 1 : 0, user_id]
	);

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('session');
	if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

	let payload: { userId: number; role: string };
	try {
		payload = verifyJwt<{ userId: number; role: string }>(token, JWT_SECRET);
	} catch {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	if (payload.role === 'Student') return json({ error: 'Forbidden' }, { status: 403 });

	const { user_id } = await request.json();

	await pool.execute(
		`DELETE FROM users WHERE user_id = ? AND role = 'Student'`,
		[user_id]
	);

	return json({ success: true });
};
