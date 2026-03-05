import { json } from '@sveltejs/kit';
import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import type { RequestHandler } from './$types';
import pool from '$lib/server/db';
import { signJwt } from '$lib/server/jwt';
import { JWT_SECRET, RESEND_API } from '$env/static/private';

const resend = new Resend(RESEND_API);

export const POST: RequestHandler = async ({ request }) => {
	const { fullName, email, password } = await request.json();

	if (!fullName || !email || !password) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	const [existing] = await pool.execute('SELECT user_id FROM users WHERE email = ?', [email]);
	if ((existing as unknown[]).length > 0) {
		return json({ error: 'Email already registered' }, { status: 409 });
	}

	const passwordHash = createHash('sha256').update(password).digest('hex');

	await pool.execute(
		`INSERT INTO users (full_name, email, password_hash, role, clearance_status, account_status, verified)
		 VALUES (?, ?, ?, 'Student', 'Pending', 'Active', FALSE)`,
		[fullName, email, passwordHash]
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
