import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { CartItem } from '$lib/types/product';

const STORAGE_KEY = 'flora-fusion-cart';

function loadInitial(): CartItem[] {
	if (!browser) return [];
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as CartItem[]) : [];
	} catch {
		return [];
	}
}

function persist(items: CartItem[]) {
	if (!browser) return;
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		/* storage unavailable, ignore */
	}
}

function createCartStore() {
	const { subscribe, update, set } = writable<CartItem[]>(loadInitial());

	subscribe((items) => persist(items));

	function addItem(item: Omit<CartItem, 'id'>) {
		update((items) => {
			const existingIndex = items.findIndex(
				(i) => i.productId === item.productId && !i.customization?.flowerSubmissionId
			);
			if (existingIndex >= 0 && !item.customization) {
				const next = [...items];
				next[existingIndex] = {
					...next[existingIndex],
					quantity: next[existingIndex].quantity + item.quantity
				};
				return next;
			}
			return [...items, { ...item, id: `${item.productId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }];
		});
	}

	function removeItem(id: string) {
		update((items) => items.filter((i) => i.id !== id));
	}

	function updateQuantity(id: string, quantity: number) {
		update((items) =>
			items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(50, quantity)) } : i))
		);
	}

	function clear() {
		set([]);
	}

	return { subscribe, addItem, removeItem, updateQuantity, clear };
}

export const cartStore = createCartStore();

export const cartCount = derived(cartStore, ($cart) => $cart.reduce((sum, item) => sum + item.quantity, 0));

export const cartSubtotal = derived(cartStore, ($cart) =>
	$cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export function getCartSnapshot(): CartItem[] {
	return get(cartStore);
}
