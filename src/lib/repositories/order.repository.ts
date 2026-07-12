import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy,
	updateDoc,
	serverTimestamp
} from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { Order, OrderStatus } from '$lib/types/product';

const ORDERS_COLLECTION = 'orders';

export async function getOrderById(id: string): Promise<Order | null> {
	const snap = await getDoc(doc(db, ORDERS_COLLECTION, id));
	if (!snap.exists()) return null;
	return normalizeOrder(snap.id, snap.data());
}

export async function listUserOrders(uid: string): Promise<Order[]> {
	const snap = await getDocs(
		query(collection(db, ORDERS_COLLECTION), where('uid', '==', uid), orderBy('createdAt', 'desc'))
	);
	return snap.docs.map((d) => normalizeOrder(d.id, d.data()));
}

export async function listAllOrders(): Promise<Order[]> {
	const snap = await getDocs(query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc')));
	return snap.docs.map((d) => normalizeOrder(d.id, d.data()));
}

export async function updateOrderStatus(
	id: string,
	orderStatus: OrderStatus,
	manufacturingProgress?: number
): Promise<void> {
	const payload: Record<string, unknown> = { orderStatus, updatedAt: serverTimestamp() };
	if (manufacturingProgress !== undefined) payload.manufacturingProgress = manufacturingProgress;
	await updateDoc(doc(db, ORDERS_COLLECTION, id), payload);
}

function normalizeOrder(id: string, data: Record<string, unknown>): Order {
	return {
		id,
		uid: data.uid as string,
		items: data.items as Order['items'],
		subtotal: data.subtotal as number,
		discount: data.discount as number,
		couponCode: (data.couponCode as string | null) ?? null,
		tax: data.tax as number,
		shippingFee: data.shippingFee as number,
		total: data.total as number,
		paymentMethod: data.paymentMethod as Order['paymentMethod'],
		paymentStatus: data.paymentStatus as Order['paymentStatus'],
		orderStatus: data.orderStatus as Order['orderStatus'],
		manufacturingProgress: (data.manufacturingProgress as number) ?? 0,
		createdAt: normalizeTimestamp(data.createdAt),
		updatedAt: normalizeTimestamp(data.updatedAt),
		estimatedDeliveryDate: data.estimatedDeliveryDate as string,
		invoiceNumber: data.invoiceNumber as string,
		notes: (data.notes as string | null) ?? null
	};
}

function normalizeTimestamp(value: unknown): string {
	if (value && typeof value === 'object' && 'toDate' in value) {
		return (value as { toDate: () => Date }).toDate().toISOString();
	}
	return typeof value === 'string' ? value : new Date().toISOString();
}
