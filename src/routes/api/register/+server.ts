import { json } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import type { RequestHandler } from './$types';
import pool from '$lib/server/db';
import { signJwt } from '$lib/server/jwt';
import { JWT_SECRET, RESEND_API } from '$env/static/private';

const resend = new Resend(RESEND_API);

export const POST: RequestHandler = async ({ request }) => {
	const { firstName, middleName, lastName, dateOfBirth, email, studentId, program, studentType, lastSchoolYear, password } = await request.json();

	if (!firstName || !lastName || !dateOfBirth || !email || !studentId || !program || !studentType || !lastSchoolYear || !password) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const [existing] = await pool.execute('SELECT user_id FROM users WHERE email = ?', [email]);
	if ((existing as unknown[]).length > 0) {
		return json({ error: 'Email already registered' }, { status: 409 });
	}

	const [existingStudentId] = await pool.execute('SELECT user_id FROM users WHERE student_id = ?', [studentId]);
	if ((existingStudentId as unknown[]).length > 0) {
		return json({ error: 'Student ID already registered' }, { status: 409 });
	}

	const passwordHash = createHash('sha256').update(password).digest('hex');
	const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

	const validTypes = ['Enrolled', 'Supplemental', 'Former', 'Alumni'];
	if (!validTypes.includes(studentType)) {
		return json({ error: 'Invalid student type' }, { status: 400 });
	}

	await pool.execute(
		`INSERT INTO users (first_name, middle_name, last_name, date_of_birth, email, password_hash, role, student_id, program, student_type, last_school_year, verified)
		 VALUES (?, ?, ?, ?, ?, ?, 'Student', ?, ?, ?, ?, FALSE)`,
		[firstName, middleName || null, lastName, dateOfBirth, email, passwordHash, studentId, program, studentType, lastSchoolYear]
	);

	const token = signJwt({ email }, JWT_SECRET, 86400);
	const verifyUrl = `${new URL(request.url).origin}/api/verify?token=${token}`;

	const { error: resendError } = await resend.emails.send({
		from: 'ESSU DocuFlow <noreply@jersondev.com>',
		to: email,
		template: {
			id: 'email-verification',
			variables: {
				full_name: fullName,
				verify_url: verifyUrl
			}
		}
	});

	if (resendError) {
		console.error('Resend error:', resendError);
		return json(
			{ error: `Account created but verification email failed: ${resendError.message}` },
			{ status: 502 }
		);
	}

	return json({ success: true, message: 'Verification email sent. Please check your inbox.' });
};
