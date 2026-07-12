import { json, type RequestHandler } from '@sveltejs/kit';
import { createSessionCookie, verifyIdToken, getUserRole } from '$lib/server/firebase-admin';

const SESSION_EXPIRES_IN_MS = 5 * 24 * 60 * 60 * 1000;

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json().catch(() => null);
	const idToken = body?.idToken;

	if (!idToken || typeof idToken !== 'string') {
		return json({ error: 'Missing ID token' }, { status: 400 });
	}

	const decoded = await verifyIdToken(idToken);
	if (!decoded) {
		return json({ error: 'Invalid or expired token' }, { status: 401 });
	}

	const role = await getUserRole(decoded.uid);
	const sessionCookie = await createSessionCookie(idToken, SESSION_EXPIRES_IN_MS);

	cookies.set('__session', sessionCookie, {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: SESSION_EXPIRES_IN_MS / 1000
	});

	return json({ ok: true, role });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
	cookies.delete('__session', { path: '/' });
	return json({ ok: true });
};
