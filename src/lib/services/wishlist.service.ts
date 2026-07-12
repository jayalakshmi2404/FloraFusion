import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '$lib/firebase';
import {
	getWishlist,
	isInWishlist,
	addToWishlist,
	removeFromWishlist
} from '$lib/repositories/wishlist.repository';
import type { WishlistItem, Product } from '$lib/types/product';

export class WishlistServiceError extends Error {}

async function adjustWishlistCount(uid: string, delta: number): Promise<void> {
	try {
		await updateDoc(doc(db, 'users', uid), {
			wishlistCount: increment(delta)
		});
	} catch {
		/* non-fatal: count is a denormalized convenience field */
	}
}

export async function fetchWishlist(uid: string): Promise<WishlistItem[]> {
	if (!uid) throw new WishlistServiceError('You must be signed in to view your wishlist.');
	return getWishlist(uid);
}

export async function checkWishlistStatus(uid: string, productId: string): Promise<boolean> {
	if (!uid) return false;
	return isInWishlist(uid, productId);
}

export async function addProductToWishlist(uid: string, product: Product): Promise<void> {
	if (!uid) throw new WishlistServiceError('You must be signed in to save items.');
	const alreadySaved = await isInWishlist(uid, product.id);
	if (alreadySaved) return;
	await addToWishlist(uid, product);
	await adjustWishlistCount(uid, 1);
}

export async function removeProductFromWishlist(uid: string, productId: string): Promise<void> {
	if (!uid) throw new WishlistServiceError('You must be signed in to manage your wishlist.');
	await removeFromWishlist(uid, productId);
	await adjustWishlistCount(uid, -1);
}

export async function toggleWishlistItem(uid: string, product: Product): Promise<boolean> {
	if (!uid) throw new WishlistServiceError('You must be signed in to save items.');
	const alreadySaved = await isInWishlist(uid, product.id);
	if (alreadySaved) {
		await removeProductFromWishlist(uid, product.id);
		return false;
	}
	await addProductToWishlist(uid, product);
	return true;
}
