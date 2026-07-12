import {
	collection,
	collectionGroup,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy,
	limit as fsLimit,
	addDoc,
	setDoc,
	updateDoc,
	serverTimestamp,
	type QueryConstraint
} from 'firebase/firestore';
import { db } from '$lib/firebase';
import type {
	Flower,
	FlowerReview,
	ColorCategory,
	FlowerCategory
} from '$lib/types/flower';
import { FLOWERS } from '$lib/constants/flowers';

const FLOWERS_COLLECTION = 'flowers';
const REVIEWS_SUBCOLLECTION = 'reviews';

export interface FlowerFilters {
	category?: FlowerCategory;
	colorCategory?: ColorCategory;
	maxPrice?: number;
	season?: string;
	searchTerm?: string;
}

export async function listFlowers(
	filters: FlowerFilters = {}
): Promise<Flower[]> {
	try {
		const constraints: QueryConstraint[] = [];

		if (filters.category) {
			constraints.push(where('category', '==', filters.category));
		}

		if (filters.colorCategory) {
			constraints.push(
				where('colorCategory', '==', filters.colorCategory)
			);
		}

		if (filters.season) {
			constraints.push(where('season', '==', filters.season));
		}

		constraints.push(orderBy('commonName'));

		const snap = await getDocs(
			query(collection(db, FLOWERS_COLLECTION), ...constraints)
		);

		if (snap.empty) {
			return applyLocalFilters(FLOWERS, filters);
		}

		const flowers = snap.docs.map((d) => {
			const local = FLOWERS.find((f) => f.id === d.id);
			return {
				...local,
				...(d.data() as Partial<Flower>),
				id: d.id
			} as Flower;
		});

		return applyLocalFilters(flowers, filters, true);
	} catch (error) {
		console.error('listFlowers Error:', error);
		return applyLocalFilters(FLOWERS, filters);
	}
}

function applyLocalFilters(
	flowers: Flower[],
	filters: FlowerFilters,
	skipBasic = false
): Flower[] {
	let result = flowers;

	if (!skipBasic) {
		if (filters.category) {
			result = result.filter((f) => f.category === filters.category);
		}

		if (filters.colorCategory) {
			result = result.filter(
				(f) => f.colorCategory === filters.colorCategory
			);
		}

		if (filters.season) {
			result = result.filter((f) => f.season === filters.season);
		}
	}

	if (filters.maxPrice !== undefined) {
		result = result.filter((f) => f.price <= filters.maxPrice!);
	}

	if (filters.searchTerm) {
		const term = filters.searchTerm.toLowerCase();

		result = result.filter(
			(f) =>
				f.commonName.toLowerCase().includes(term) ||
				f.botanicalName.toLowerCase().includes(term) ||
				f.tags.some((t) => t.toLowerCase().includes(term))
		);
	}

	return result;
}

export async function getFlowerById(id: string): Promise<Flower | null> {
	try {
		const snap = await getDoc(doc(db, FLOWERS_COLLECTION, id));

		if (snap.exists()) {
			const local = FLOWERS.find((f) => f.id === id);
			return {
				...local,
				...(snap.data() as Partial<Flower>),
				id: snap.id
			} as Flower;
		}
	} catch (error) {
		console.error('Error loading flower:', error);
	}

	return FLOWERS.find((f) => f.id === id) ?? null;
}

export async function getFeaturedFlowers(
	count = 8
): Promise<Flower[]> {
	try {
		const snap = await getDocs(
			query(
				collection(db, FLOWERS_COLLECTION),
				orderBy('rating', 'desc'),
				fsLimit(count)
			)
		);

		if (!snap.empty) {
			return snap.docs.map((d) => {
				const local = FLOWERS.find((f) => f.id === d.id);
				return {
					...local,
					...(d.data() as Partial<Flower>),
					id: d.id
				} as Flower;
			});
		}
	} catch (error) {
		console.error(error);
	}

	return [...FLOWERS]
		.sort((a, b) => b.rating - a.rating)
		.slice(0, count);
}

export async function addFlowerReview(
	flowerId: string,
	review: Omit<FlowerReview, 'id' | 'createdAt'>
): Promise<void> {
	await addDoc(
		collection(db, FLOWERS_COLLECTION, flowerId, REVIEWS_SUBCOLLECTION),
		{
			...review,
			createdAt: serverTimestamp()
		}
	);
}

export async function getFlowerReviews(
	flowerId: string
): Promise<FlowerReview[]> {
	try {
		const snap = await getDocs(
			query(
				collection(
					db,
					FLOWERS_COLLECTION,
					flowerId,
					REVIEWS_SUBCOLLECTION
				),
				orderBy('createdAt', 'desc')
			)
		);

		return snap.docs.map((d) => ({
			id: d.id,
			...(d.data() as Omit<FlowerReview, 'id'>)
		}));
	} catch {
		return [];
	}
}

export async function getUserReviews(
	uid: string
): Promise<(FlowerReview & { flowerId: string })[]> {
	try {
		const snap = await getDocs(
			query(
				collectionGroup(db, REVIEWS_SUBCOLLECTION),
				where('uid', '==', uid),
				orderBy('createdAt', 'desc')
			)
		);

		return snap.docs.map((d) => ({
			id: d.id,
			flowerId: d.ref.parent.parent?.id ?? '',
			...(d.data() as Omit<FlowerReview, 'id'>)
		}));
	} catch {
		return [];
	}
}

export function getAvailableCount(flowers: Flower[]): number {
	return flowers.filter(
		(f) => f.availability && f.remainingStock > 0
	).length;
}

export async function adminUpdateFlower(
	id: string,
	updates: Partial<Flower>
): Promise<void> {
	await setDoc(doc(db, FLOWERS_COLLECTION, id), updates, {
		merge: true
	});
}

export async function adminUpdateFlowerImage(
	id: string,
	slot: 'mainImage' | 'galleryImages',
	value: string | string[]
): Promise<void> {
	await updateDoc(doc(db, FLOWERS_COLLECTION, id), {
		[slot]: value
	});
}

export async function seedFlowerIfMissing(
	flower: Flower
): Promise<void> {
	const snap = await getDoc(doc(db, FLOWERS_COLLECTION, flower.id));

	if (!snap.exists()) {
		await setDoc(doc(db, FLOWERS_COLLECTION, flower.id), flower);
	}
}