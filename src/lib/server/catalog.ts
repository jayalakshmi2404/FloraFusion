import { getAdminDbInstance } from '$lib/server/firebase-admin';
import { PRODUCTS } from '$lib/constants/products';
import { FLOWERS } from '$lib/constants/flowers';

export interface CatalogItem {
	id: string;
	name: string;
	image: string;
	price: number;
	inStock: boolean;
}

export async function resolveCatalogItem(id: string): Promise<CatalogItem | null> {
	const localProduct = PRODUCTS.find((p) => p.id === id);
	const localFlower = FLOWERS.find((f) => f.id === id);

	try {
		const productSnap = await getAdminDbInstance().collection('products').doc(id).get();
		if (productSnap.exists) {
			const data = productSnap.data()!;
			return {
				id,
				name: data.name ?? localProduct?.name,
				image: data.mainImage ?? localProduct?.mainImage,
				price: typeof data.price === 'number' ? data.price : localProduct?.price,
				inStock: data.inventory?.inStock ?? localProduct?.inventory.inStock ?? true
			} as CatalogItem;
		}
	} catch {
		/* fall through to local constant */
	}

	if (localProduct) {
		return {
			id,
			name: localProduct.name,
			image: localProduct.mainImage,
			price: localProduct.price,
			inStock: localProduct.inventory.inStock
		};
	}

	try {
		const flowerSnap = await getAdminDbInstance().collection('flowers').doc(id).get();
		if (flowerSnap.exists) {
			const data = flowerSnap.data()!;
			return {
				id,
				name: data.commonName ?? localFlower?.commonName,
				image: data.mainImage ?? localFlower?.mainImage,
				price: typeof data.price === 'number' ? data.price : localFlower?.price,
				inStock:
					(data.availability ?? localFlower?.availability ?? true) &&
					(data.remainingStock ?? localFlower?.remainingStock ?? 0) > 0
			} as CatalogItem;
		}
	} catch {
		/* fall through to local constant */
	}

	if (localFlower) {
		return {
			id,
			name: localFlower.commonName,
			image: localFlower.mainImage,
			price: localFlower.price,
			inStock: localFlower.availability && localFlower.remainingStock > 0
		};
	}

	return null;
}

export async function resolveCatalogItems(ids: string[]): Promise<Map<string, CatalogItem>> {
	const results = await Promise.all(ids.map((id) => resolveCatalogItem(id)));
	const map = new Map<string, CatalogItem>();
	results.forEach((item, i) => {
		if (item) map.set(ids[i], item);
	});
	return map;
}