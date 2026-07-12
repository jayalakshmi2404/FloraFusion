import { json, type RequestHandler } from '@sveltejs/kit';
import { emailSchema } from '$lib/schemas/validation';
import { getAdminDbInstance } from '$lib/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);

	const result = emailSchema.safeParse(body?.email);
	if (!result.success) {
		return json({ error: result.error.issues[0]?.message ?? 'Invalid email' }, { status: 400 });
	}

	const email = result.data;
	const docId = Buffer.from(email).toString('base64url');

	await getAdminDbInstance()
		.collection('newsletter_subscribers')
		.doc(docId)
		.set(
			{
				email,
				subscribedAt: FieldValue.serverTimestamp(),
				active: true
			},
			{ merge: true }
		);

	return json({ ok: true });
};
