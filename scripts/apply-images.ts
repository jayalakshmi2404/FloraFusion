import 'dotenv/config';
import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
	credential: cert({
		projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
		clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
		privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
	})
});

const db = getFirestore(app);

interface ImagesFile {
	flowers: Record<string, string>;
	products: Record<string, string>;
}

const data: ImagesFile = JSON.parse(readFileSync('flora-fusion-images.json', 'utf-8'));

async function applyCollection(collectionName: string, entries: Record<string, string>) {
	for (const [id, url] of Object.entries(entries)) {
		if (!url) continue;

		await db
			.collection(collectionName)
			.doc(id)
			.set(
				{
					mainImage: url,
					...(collectionName === 'flowers' ? { galleryImages: [url] } : { gallery: [url] })
				},
				{ merge: true }
			);

		console.log(`Updated ${collectionName}/${id}`);
	}
}

async function main() {
	await applyCollection('flowers', data.flowers);
	await applyCollection('products', data.products);
	console.log('Done.');
	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});