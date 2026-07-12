import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { WishlistItem, Product } from '$lib/types/product';

function wishlistCollection(uid: string) {
	return collection(db, 'users', uid, 'wishlist');
}

export async function getWishlist(uid: string): Promise<WishlistItem[]> {
	const snap = await getDocs(wishlistCollection(uid));
	return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<WishlistItem, 'id'>) }));
}

export async function isInWishlist(uid: string, productId: string): Promise<boolean> {
	const snap = await getDoc(doc(db, 'users', uid, 'wishlist', productId));
	return snap.exists();
}

export async function addToWishlist(uid: string, product: Product): Promise<void> {
	await setDoc(doc(db, 'users', uid, 'wishlist', product.id), {
		productId: product.id,
		productName: product.name,
		image: product.mainImage,
		price: product.price,
		addedAt: serverTimestamp()
	});
}

export async function removeFromWishlist(uid: string, productId: string): Promise<void> {
	await deleteDoc(doc(db, 'users', uid, 'wishlist', productId));
}

export async function toggleWishlist(uid: string, product: Product): Promise<boolean> {
	const exists = await isInWishlist(uid, product.id);
	if (exists) {
		await removeFromWishlist(uid, product.id);
		return false;
	}
	await addToWishlist(uid, product);
	return true;
}
