import {
	collection,
	doc,
	addDoc,
	getDoc,
	getDocs,
	query,
	where,
	orderBy,
	serverTimestamp,
	updateDoc
} from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { FlowerSubmission } from '$lib/types/flower';
import type { FlowerSubmissionInput } from '$lib/schemas/validation';
import { calculateWeightEngine } from '$lib/services/weight-engine.service';

const SUBMISSIONS_COLLECTION = 'flower_submissions';

export async function createFlowerSubmission(
	uid: string,
	input: FlowerSubmissionInput
): Promise<string> {
	const weightEngineResult = calculateWeightEngine(input.flowerWeightGrams);

	const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
		uid,
		flowerType: input.flowerType,
		flowerWeightGrams: input.flowerWeightGrams,
		occasion: input.occasion,
		photos: input.photos,
		description: input.description,
		preferredDeliveryDate: input.preferredDeliveryDate,
		status: 'Submitted',
		weightEngineResult,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp()
	});

	return docRef.id;
}

export async function getSubmissionById(id: string): Promise<FlowerSubmission | null> {
	const snap = await getDoc(doc(db, SUBMISSIONS_COLLECTION, id));
	if (!snap.exists()) return null;
	return normalizeSubmission(snap.id, snap.data());
}

export async function listUserSubmissions(uid: string): Promise<FlowerSubmission[]> {
	const snap = await getDocs(
		query(collection(db, SUBMISSIONS_COLLECTION), where('uid', '==', uid), orderBy('createdAt', 'desc'))
	);
	return snap.docs.map((d) => normalizeSubmission(d.id, d.data()));
}

export async function listAllSubmissions(): Promise<FlowerSubmission[]> {
	const snap = await getDocs(query(collection(db, SUBMISSIONS_COLLECTION), orderBy('createdAt', 'desc')));
	return snap.docs.map((d) => normalizeSubmission(d.id, d.data()));
}

export async function updateSubmissionStatus(
	id: string,
	status: FlowerSubmission['status']
): Promise<void> {
	await updateDoc(doc(db, SUBMISSIONS_COLLECTION, id), {
		status,
		updatedAt: serverTimestamp()
	});
}

function normalizeSubmission(id: string, data: Record<string, unknown>): FlowerSubmission {
	return {
		id,
		uid: data.uid as string,
		flowerType: data.flowerType as string,
		flowerWeightGrams: data.flowerWeightGrams as number,
		occasion: data.occasion as FlowerSubmission['occasion'],
		photos: (data.photos as string[]) ?? [],
		description: (data.description as string) ?? '',
		preferredDeliveryDate: data.preferredDeliveryDate as string,
		status: data.status as FlowerSubmission['status'],
		createdAt: normalizeTimestamp(data.createdAt),
		updatedAt: normalizeTimestamp(data.updatedAt),
		weightEngineResult: data.weightEngineResult as FlowerSubmission['weightEngineResult']
	};
}

function normalizeTimestamp(value: unknown): string {
	if (value && typeof value === 'object' && 'toDate' in value) {
		return (value as { toDate: () => Date }).toDate().toISOString();
	}
	return typeof value === 'string' ? value : new Date().toISOString();
}
