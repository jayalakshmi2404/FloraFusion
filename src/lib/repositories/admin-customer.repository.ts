import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { UserProfile } from '$lib/types/user';

const USERS_COLLECTION = 'users';

export async function listAllCustomers(): Promise<UserProfile[]> {
	const snap = await getDocs(query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc')));
	return snap.docs
		.map((d) => normalize(d.id, d.data()))
		.filter((u) => u.role === 'user');
}

export async function setCustomerNotificationPreference(uid: string, enabled: boolean): Promise<void> {
	await updateDoc(doc(db, USERS_COLLECTION, uid), { notificationsEnabled: enabled });
}

function normalize(uid: string, data: Record<string, unknown>): UserProfile {
	return {
		uid,
		fullName: data.fullName as string,
		email: data.email as string,
		role: data.role as UserProfile['role'],
		phoneVerified: (data.phoneVerified as boolean) ?? false,
		emailVerified: (data.emailVerified as boolean) ?? false,
		photoURL: (data.photoURL as string | null) ?? null,
		createdAt: normalizeTimestamp(data.createdAt),
		updatedAt: normalizeTimestamp(data.updatedAt),
		lastLoginAt: data.lastLoginAt ? normalizeTimestamp(data.lastLoginAt) : null,
		wishlistCount: (data.wishlistCount as number) ?? 0,
		ordersCount: (data.ordersCount as number) ?? 0,
		notificationsEnabled: (data.notificationsEnabled as boolean) ?? true
	};
}

function normalizeTimestamp(value: unknown): string {
	if (value && typeof value === 'object' && 'toDate' in value) {
		return (value as { toDate: () => Date }).toDate().toISOString();
	}
	return typeof value === 'string' ? value : new Date().toISOString();
}
