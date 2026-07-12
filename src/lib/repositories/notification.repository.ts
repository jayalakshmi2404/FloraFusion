import {
	collection,
	doc,
	addDoc,
	getDocs,
	query,
	where,
	orderBy,
	limit as fsLimit,
	updateDoc,
	writeBatch,
	serverTimestamp
} from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { AppNotification, NotificationType } from '$lib/types/notification';

const NOTIFICATIONS_COLLECTION = 'notifications';

export async function listUserNotifications(uid: string, count = 50): Promise<AppNotification[]> {
	const snap = await getDocs(
		query(
			collection(db, NOTIFICATIONS_COLLECTION),
			where('uid', '==', uid),
			orderBy('createdAt', 'desc'),
			fsLimit(count)
		)
	);
	return snap.docs.map((d) => normalize(d.id, d.data()));
}

export async function getUnreadCount(uid: string): Promise<number> {
	const snap = await getDocs(
		query(collection(db, NOTIFICATIONS_COLLECTION), where('uid', '==', uid), where('read', '==', false))
	);
	return snap.size;
}

export async function markAsRead(id: string): Promise<void> {
	await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, id), { read: true });
}

export async function markAllAsRead(uid: string): Promise<void> {
	const snap = await getDocs(
		query(collection(db, NOTIFICATIONS_COLLECTION), where('uid', '==', uid), where('read', '==', false))
	);
	const batch = writeBatch(db);
	snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
	await batch.commit();
}

export async function createNotification(
	uid: string,
	type: NotificationType,
	title: string,
	message: string,
	link: string | null = null
): Promise<void> {
	await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
		uid,
		type,
		title,
		message,
		link,
		read: false,
		createdAt: serverTimestamp()
	});
}

function normalize(id: string, data: Record<string, unknown>): AppNotification {
	return {
		id,
		uid: data.uid as string,
		type: data.type as NotificationType,
		title: data.title as string,
		message: data.message as string,
		link: (data.link as string | null) ?? null,
		read: (data.read as boolean) ?? false,
		createdAt: normalizeTimestamp(data.createdAt)
	};
}

function normalizeTimestamp(value: unknown): string {
	if (value && typeof value === 'object' && 'toDate' in value) {
		return (value as { toDate: () => Date }).toDate().toISOString();
	}
	return typeof value === 'string' ? value : new Date().toISOString();
}
