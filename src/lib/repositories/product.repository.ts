import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy
} from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { Product } from '$lib/types/product';
import { PRODUCTS } from '$lib/constants/products';

const PRODUCTS_COLLECTION = 'products';

export interface ProductFilters {
	category?: string;
	maxPrice?: number;
	searchTerm?: string;
	customizableOnly?: boolean;
}

export async function listProducts(filters: ProductFilters = {}): Promise<Product[]> {
	try {
		const snap = await getDocs(
			query(collection(db, PRODUCTS_COLLECTION), orderBy('name'))
		);

		if (snap.empty) {
			return applyFilters(PRODUCTS, filters);
		}

		const products = snap.docs.map((d) => {
			const local = PRODUCTS.find((p) => p.id === d.id);

			return {
				...local,
				...(d.data() as Partial<Product>),
				id: d.id
			} as Product;
		});

		return applyFilters(products, filters);
	} catch (error) {
		console.error('Error loading products:', error);
		return applyFilters(PRODUCTS, filters);
	}
}

function applyFilters(products: Product[], filters: ProductFilters): Product[] {
	let result = products;

	if (filters.category) {
		result = result.filter((p) => p.category === filters.category);
	}

	if (filters.maxPrice !== undefined) {
		result = result.filter((p) => p.price <= filters.maxPrice!);
	}

	if (filters.customizableOnly) {
		result = result.filter((p) => p.isCustomizable);
	}

	if (filters.searchTerm) {
		const term = filters.searchTerm.toLowerCase();

		result = result.filter(
			(p) =>
				p.name.toLowerCase().includes(term) ||
				p.description.toLowerCase().includes(term) ||
				p.tags.some((t) => t.toLowerCase().includes(term))
		);
	}

	return result;
}

export async function getProductById(id: string): Promise<Product | null> {
	const localProduct = PRODUCTS.find((p) => p.id === id);

	try {
		const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, id));

		if (snap.exists()) {
			return {
				...localProduct,
				...(snap.data() as Partial<Product>),
				id: snap.id
			} as Product;
		}
	} catch (error) {
		console.error('Error loading product:', error);
	}

	return localProduct ?? null;
}

export async function getFeaturedProductsList(count = 8): Promise<Product[]> {
	try {
		const snap = await getDocs(
			query(
				collection(db, PRODUCTS_COLLECTION),
				where('isFeatured', '==', true)
			)
		);

		if (!snap.empty) {
			return snap.docs
				.map((d) => {
					const local = PRODUCTS.find((p) => p.id === d.id);

					return {
						...local,
						...(d.data() as Partial<Product>),
						id: d.id
					} as Product;
				})
				.slice(0, count);
		}
	} catch (error) {
		console.error('Error loading featured products:', error);
	}

	return PRODUCTS.filter((p) => p.isFeatured).slice(0, count);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
	const results = await Promise.all(ids.map((id) => getProductById(id)));
	return results.filter((p): p is Product => p !== null);
}