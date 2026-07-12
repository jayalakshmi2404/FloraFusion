/**
 * Flora Fusion — Firestore Seed Script
 *
 * Populates the `flowers`, `products`, and `coupons` collections from the
 * bundled catalog constants. Safe to re-run: uses `set` with merge so it
 * will not duplicate documents, and will not overwrite admin-edited stock
 * levels unless the flag `--force` is passed.
 *
 * Usage:
 *   npm run seed
 *   npm run seed -- --force
 */
import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { FLOWERS } from '../src/lib/constants/flowers';
import { PRODUCTS } from '../src/lib/constants/products';
import { COUPONS } from '../src/lib/constants/coupons';

const force = process.argv.includes('--force');

function requiredEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		console.error(`Missing required environment variable: ${name}`);
		process.exit(1);
	}
	return value;
}

const app = initializeApp({
	credential: cert({
		projectId: requiredEnv('FIREBASE_ADMIN_PROJECT_ID'),
		clientEmail: requiredEnv('FIREBASE_ADMIN_CLIENT_EMAIL'),
		privateKey: requiredEnv('FIREBASE_ADMIN_PRIVATE_KEY').replace(/\\n/g, '\n')
	})
});

const db = getFirestore(app);

async function seedCollection<T extends { id: string }>(
	collectionName: string,
	items: T[],
	idField: keyof T = 'id'
): Promise<void> {
	console.log(`Seeding ${items.length} documents into "${collectionName}"...`);
	const batchSize = 400;

	for (let i = 0; i < items.length; i += batchSize) {
		const batch = db.batch();
		const chunk = items.slice(i, i + batchSize);

		for (const item of chunk) {
			const docId = String(item[idField]);
			const ref = db.collection(collectionName).doc(docId);

			if (force) {
				batch.set(ref, item);
			} else {
				const existing = await ref.get();
				if (!existing.exists) {
					batch.set(ref, item);
				}
			}
		}

		await batch.commit();
	}

	console.log(`✓ Finished seeding "${collectionName}"`);
}

async function seedCoupons(): Promise<void> {
	console.log(`Seeding ${COUPONS.length} coupons...`);
	const batch = db.batch();
	for (const coupon of COUPONS) {
		const ref = db.collection('coupons').doc(coupon.code);
		if (force) {
			batch.set(ref, coupon);
		}
	}
	if (force) {
		await batch.commit();
	} else {
		for (const coupon of COUPONS) {
			const ref = db.collection('coupons').doc(coupon.code);
			const existing = await ref.get();
			if (!existing.exists) {
				await ref.set(coupon);
			}
		}
	}
	console.log('✓ Finished seeding coupons');
}

async function main() {
	console.log(`Starting Flora Fusion Firestore seed${force ? ' (force mode)' : ''}...`);

	await seedCollection('flowers', FLOWERS);
	await seedCollection('products', PRODUCTS);
	await seedCoupons();

	console.log('All seed operations complete.');
	process.exit(0);
}

main().catch((error) => {
	console.error('Seed script failed:', error);
	process.exit(1);
});
