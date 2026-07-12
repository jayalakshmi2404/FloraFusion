import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	sendPasswordResetEmail,
	confirmPasswordReset,
	updateProfile as firebaseUpdateProfile,
	onIdTokenChanged,
	type User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '$lib/firebase';
import type { RegisterInput, LoginInput } from '$lib/schemas/validation';
import type { UserProfile, UserRole, ResetPasswordPayload } from '$lib/types/user';

export class AuthServiceError extends Error {
	constructor(
		public code: string,
		message: string
	) {
		super(message);
		this.name = 'AuthServiceError';
	}
}

function mapFirebaseError(error: unknown): AuthServiceError {
	const code = (error as { code?: string })?.code ?? 'unknown';
	const messages: Record<string, string> = {
		'auth/email-already-in-use': 'An account with this email already exists.',
		'auth/invalid-email': 'Please enter a valid email address.',
		'auth/weak-password': 'Your password does not meet the security requirements.',
		'auth/user-not-found': 'No account found with this email.',
		'auth/wrong-password': 'Incorrect email or password.',
		'auth/invalid-credential': 'Incorrect email or password.',
		'auth/too-many-requests': 'Too many attempts. Please try again later.',
		'auth/user-disabled': 'This account has been disabled. Contact florafusion111@gmail.com.',
		'auth/expired-action-code': 'This reset link has expired. Please request a new one.',
		'auth/invalid-action-code': 'This reset link is invalid or has already been used.'
	};
	return new AuthServiceError(code, messages[code] ?? 'Something went wrong. Please try again.');
}

export async function registerUser(input: RegisterInput): Promise<User> {
	try {
		const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
		await firebaseUpdateProfile(credential.user, { displayName: input.fullName });

		const profile: Omit<UserProfile, 'uid'> = {
			fullName: input.fullName,
			email: input.email,
			role: 'user',
			phoneVerified: false,
			emailVerified: false,
			photoURL: null,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			lastLoginAt: new Date().toISOString(),
			wishlistCount: 0,
			ordersCount: 0,
			notificationsEnabled: true
		};

		await setDoc(doc(db, 'users', credential.user.uid), {
			...profile,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			lastLoginAt: serverTimestamp()
		});

		return credential.user;
	} catch (error) {
		throw mapFirebaseError(error);
	}
}

export async function loginUser(input: LoginInput): Promise<User> {
	try {
		const credential = await signInWithEmailAndPassword(auth, input.email, input.password);
		const profileSnap = await getDoc(doc(db, 'users', credential.user.uid));

		if (!profileSnap.exists()) {
			await firebaseSignOut(auth);
			throw new AuthServiceError('auth/user-not-found', 'No account found with this email.');
		}

		const role = profileSnap.data().role as UserRole;

		if (role !== input.role) {
			await firebaseSignOut(auth);
			throw new AuthServiceError(
				'auth/role-mismatch',
				input.role === 'admin'
					? 'This account does not have admin access.'
					: 'Please use the Admin login for this account.'
			);
		}

		await updateDoc(doc(db, 'users', credential.user.uid), {
			lastLoginAt: serverTimestamp()
		});

		return credential.user;
	} catch (error) {
		if (error instanceof AuthServiceError) throw error;
		throw mapFirebaseError(error);
	}
}

export async function logoutUser(): Promise<void> {
	await firebaseSignOut(auth);
	await fetch('/api/auth/session', { method: 'DELETE' });
}

export async function requestPasswordReset(email: string): Promise<void> {
	try {
		await sendPasswordResetEmail(auth, email, {
			url: `${window.location.origin}/login`,
			handleCodeInApp: false
		});
	} catch (error) {
		throw mapFirebaseError(error);
	}
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
	try {
		await confirmPasswordReset(auth, payload.oobCode, payload.newPassword);
	} catch (error) {
		throw mapFirebaseError(error);
	}
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
	const snap = await getDoc(doc(db, 'users', uid));
	if (!snap.exists()) return null;
	const data = snap.data();
	return {
		uid,
		fullName: data.fullName,
		email: data.email,
		role: data.role,
		phoneVerified: data.phoneVerified ?? false,
		emailVerified: data.emailVerified ?? false,
		photoURL: data.photoURL ?? null,
		createdAt: data.createdAt?.toDate?.().toISOString?.() ?? data.createdAt,
		updatedAt: data.updatedAt?.toDate?.().toISOString?.() ?? data.updatedAt,
		lastLoginAt: data.lastLoginAt?.toDate?.().toISOString?.() ?? data.lastLoginAt,
		wishlistCount: data.wishlistCount ?? 0,
		ordersCount: data.ordersCount ?? 0,
		notificationsEnabled: data.notificationsEnabled ?? true
	};
}

export async function syncSessionCookie(user: User | null): Promise<void> {
	if (!user) {
		await fetch('/api/auth/session', { method: 'DELETE' });
		return;
	}
	const idToken = await user.getIdToken();
	await fetch('/api/auth/session', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ idToken })
	});
}

export function watchIdTokenChanges(callback: (user: User | null) => void): () => void {
	return onIdTokenChanged(auth, callback);
}

export async function updateUserProfile(
	uid: string,
	updates: { fullName?: string; photoURL?: string | null; notificationsEnabled?: boolean }
): Promise<void> {
	const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
	if (updates.fullName !== undefined) payload.fullName = updates.fullName;
	if (updates.photoURL !== undefined) payload.photoURL = updates.photoURL;
	if (updates.notificationsEnabled !== undefined) payload.notificationsEnabled = updates.notificationsEnabled;

	await updateDoc(doc(db, 'users', uid), payload);

	if (auth.currentUser && (updates.fullName !== undefined || updates.photoURL !== undefined)) {
		await firebaseUpdateProfile(auth.currentUser, {
			displayName: updates.fullName,
			photoURL: updates.photoURL ?? undefined
		});
	}
}