import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage, type Storage } from 'firebase-admin/storage';
import {
	FIREBASE_ADMIN_PROJECT_ID,
	FIREBASE_ADMIN_CLIENT_EMAIL,
	FIREBASE_ADMIN_PRIVATE_KEY,
	FIREBASE_ADMIN_STORAGE_BUCKET
} from '$env/static/private';

/**
 * The Firebase Admin SDK is initialized lazily on first use rather than at
 * module load time. `hooks.server.ts` imports this module on every request
 * (to check for a session cookie), so eager initialization would mean an
 * invalid or placeholder FIREBASE_ADMIN_PRIVATE_KEY crashes the entire dev
 * server before a single page can load. Lazy init means the app boots fine
 * with placeholder credentials, and only routes that actually touch Admin
 * SDK features (login, checkout, admin dashboard writes, etc.) will error —
 * with a clear message — until real credentials are supplied.
 */
let cachedApp: App | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedStorage: Storage | null = null;

function getAdminApp(): App {
	if (cachedApp) return cachedApp;
	if (getApps().length) {
		cachedApp = getApps()[0];
		return cachedApp;
	}

	if (!FIREBASE_ADMIN_PROJECT_ID || !FIREBASE_ADMIN_CLIENT_EMAIL || !FIREBASE_ADMIN_PRIVATE_KEY) {
		throw new Error(
			'Firebase Admin credentials are missing. Set FIREBASE_ADMIN_PROJECT_ID, ' +
				'FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in your .env file. ' +
				'See .env.example for the expected format.'
		);
	}

	const privateKey = FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');

	cachedApp = initializeApp({
		credential: cert({
			projectId: FIREBASE_ADMIN_PROJECT_ID,
			clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
			privateKey
		}),
		storageBucket: FIREBASE_ADMIN_STORAGE_BUCKET
	});
	return cachedApp;
}

export function getAdminAuthInstance(): Auth {
	if (!cachedAuth) cachedAuth = getAuth(getAdminApp());
	return cachedAuth;
}

export function getAdminDbInstance(): Firestore {
	if (!cachedDb) cachedDb = getFirestore(getAdminApp());
	return cachedDb;
}

export function getAdminStorageInstance(): Storage {
	if (!cachedStorage) cachedStorage = getStorage(getAdminApp());
	return cachedStorage;
}

export async function verifySessionCookie(sessionCookie: string) {
	try {
		const decoded = await getAdminAuthInstance().verifySessionCookie(sessionCookie, true);
		return decoded;
	} catch {
		return null;
	}
}

export async function verifyIdToken(idToken: string) {
	try {
		const decoded = await getAdminAuthInstance().verifyIdToken(idToken, true);
		return decoded;
	} catch {
		return null;
	}
}

export async function createSessionCookie(idToken: string, expiresInMs: number) {
	return getAdminAuthInstance().createSessionCookie(idToken, { expiresIn: expiresInMs });
}

export async function getUserRole(uid: string): Promise<'user' | 'admin' | null> {
	const snap = await getAdminDbInstance().collection('users').doc(uid).get();
	if (!snap.exists) return null;
	const data = snap.data();
	return (data?.role as 'user' | 'admin') ?? 'user';
}
