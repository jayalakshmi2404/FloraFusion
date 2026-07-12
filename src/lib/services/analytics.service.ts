import { logEvent, setAnalyticsCollectionEnabled, type Analytics } from 'firebase/analytics';
import { getAnalyticsInstance } from '$lib/firebase';

let analyticsInstance: Analytics | null = null;
let initPromise: Promise<Analytics | null> | null = null;

async function ensureAnalytics(): Promise<Analytics | null> {
	if (analyticsInstance) return analyticsInstance;
	if (!initPromise) {
		initPromise = getAnalyticsInstance();
	}
	analyticsInstance = await initPromise;
	return analyticsInstance;
}

export async function initAnalytics(): Promise<void> {
	const analytics = await ensureAnalytics();
	if (analytics) {
		setAnalyticsCollectionEnabled(analytics, true);
	}
}

export async function trackPageView(path: string, title: string): Promise<void> {
	const analytics = await ensureAnalytics();
	if (!analytics) return;
	logEvent(analytics, 'page_view', { page_path: path, page_title: title });
}

export async function trackViewItem(item: {
	id: string;
	name: string;
	category: string;
	price: number;
}): Promise<void> {
	const analytics = await ensureAnalytics();
	if (!analytics) return;
	logEvent(analytics, 'view_item', {
		currency: 'INR',
		value: item.price,
		items: [{ item_id: item.id, item_name: item.name, item_category: item.category, price: item.price }]
	});
}

export async function trackAddToCart(item: {
	id: string;
	name: string;
	price: number;
	quantity: number;
}): Promise<void> {
	const analytics = await ensureAnalytics();
	if (!analytics) return;
	logEvent(analytics, 'add_to_cart', {
		currency: 'INR',
		value: item.price * item.quantity,
		items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity }]
	});
}

export async function trackBeginCheckout(value: number, itemCount: number): Promise<void> {
	const analytics = await ensureAnalytics();
	if (!analytics) return;
	logEvent(analytics, 'begin_checkout', { currency: 'INR', value, item_count: itemCount });
}

export async function trackPurchase(order: {
	orderId: string;
	total: number;
	tax: number;
	shipping: number;
	coupon?: string | null;
}): Promise<void> {
	const analytics = await ensureAnalytics();
	if (!analytics) return;
	logEvent(analytics, 'purchase', {
		transaction_id: order.orderId,
		currency: 'INR',
		value: order.total,
		tax: order.tax,
		shipping: order.shipping,
		coupon: order.coupon ?? undefined
	});
}

export async function trackSignUp(method: 'email'): Promise<void> {
	const analytics = await ensureAnalytics();
	if (!analytics) return;
	logEvent(analytics, 'sign_up', { method });
}

export async function trackLogin(method: 'email', role: 'user' | 'admin'): Promise<void> {
	const analytics = await ensureAnalytics();
	if (!analytics) return;
	logEvent(analytics, 'login', { method, role });
}

export async function trackFlowerSubmission(weightGrams: number, occasion: string): Promise<void> {
	const analytics = await ensureAnalytics();
	if (!analytics) return;
	logEvent(analytics, 'submit_flowers', { weight_grams: weightGrams, occasion });
}

export async function trackSearch(searchTerm: string): Promise<void> {
	const analytics = await ensureAnalytics();
	if (!analytics) return;
	logEvent(analytics, 'search', { search_term: searchTerm });
}
