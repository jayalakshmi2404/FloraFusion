import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';
import { storage } from '$lib/firebase';
import { nanoid } from 'nanoid';

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export class StorageServiceError extends Error {}

function validateImageFile(file: File): void {
	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
		throw new StorageServiceError('Only JPEG, PNG, WEBP, or AVIF images are allowed.');
	}
	if (file.size > MAX_FILE_SIZE_BYTES) {
		throw new StorageServiceError('Image must be smaller than 8MB.');
	}
}

export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
	validateImageFile(file);
	const path = `avatars/${uid}/${nanoid(8)}-${file.name}`;
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, file, { contentType: file.type });
	return getDownloadURL(storageRef);
}

export async function uploadFlowerSubmissionPhoto(
	uid: string,
	file: File,
	onProgress?: (percent: number) => void
): Promise<string> {
	validateImageFile(file);
	const path = `submissions/${uid}/${nanoid(10)}-${file.name}`;
	const storageRef = ref(storage, path);

	return new Promise((resolve, reject) => {
		const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
		task.on(
			'state_changed',
			(snapshot) => {
				const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				onProgress?.(percent);
			},
			(error) => reject(new StorageServiceError(error.message)),
			async () => {
				const url = await getDownloadURL(task.snapshot.ref);
				resolve(url);
			}
		);
	});
}

export async function uploadFlowerImage(
	flowerId: string,
	file: File,
	slot: 'main' | 'gallery-1' | 'gallery-2' | 'gallery-3'
): Promise<string> {
	validateImageFile(file);
	const extension = file.type.split('/')[1];
	const path = `flowers/${flowerId}/${slot}.${extension}`;
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, file, { contentType: file.type });
	return path;
}

export async function uploadProductImage(productId: string, file: File, index: number): Promise<string> {
	validateImageFile(file);
	const extension = file.type.split('/')[1];
	const path = `products/${productId}/image-${index}.${extension}`;
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, file, { contentType: file.type });
	return path;
}

export async function deleteStorageFile(path: string): Promise<void> {
	try {
		await deleteObject(ref(storage, path));
	} catch {
		/* file may already be removed; ignore */
	}
}
