import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { browser, dev } from '$app/environment';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID,
	PUBLIC_FIREBASE_MEASUREMENT_ID,
	PUBLIC_USE_FIREBASE_EMULATORS
} from '$env/static/public';

const firebaseConfig: FirebaseOptions = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID,
	measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const firebaseApp =
	getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

let emulatorsConnected = false;

if (
	browser &&
	dev &&
	PUBLIC_USE_FIREBASE_EMULATORS === 'true' &&
	!emulatorsConnected
) {
	connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
		disableWarnings: true
	});
	connectFirestoreEmulator(db, '127.0.0.1', 8080);
	connectStorageEmulator(storage, '127.0.0.1', 9199);
	emulatorsConnected = true;

	console.log('Using Firebase Emulators');
}

export async function getAnalyticsInstance() {
	if (!browser) return null;

	const supported = await isSupported();
	if (!supported) return null;

	return getAnalytics(firebaseApp);
}

export function getPerformanceInstance() {
	if (!browser) return null;

	try {
		return getPerformance(firebaseApp);
	} catch {
		return null;
	}
}