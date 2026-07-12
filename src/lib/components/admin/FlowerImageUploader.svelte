<script lang="ts">
	import { uploadFlowerImage, StorageServiceError } from '$lib/services/storage.service';
	import { adminUpdateFlowerImage } from '$lib/repositories/flower.repository';
	import { resolveStorageUrl } from '$lib/utils/storage-url';
	import { toastStore } from '$lib/stores/toast.store';
	import type { Flower } from '$lib/types/flower';

	interface Props {
		flower: Flower;
	}

	let { flower = $bindable() }: Props = $props();

	let uploadingSlot = $state<string>('');

	const slots: { key: 'main' | 'gallery-1' | 'gallery-2' | 'gallery-3'; label: string }[] = [
		{ key: 'main', label: 'Main Image' },
		{ key: 'gallery-1', label: 'Gallery 1' },
		{ key: 'gallery-2', label: 'Gallery 2' },
		{ key: 'gallery-3', label: 'Gallery 3' }
	];

	function currentPath(slotKey: string): string {
		if (slotKey === 'main') return flower.mainImage;
		const index = Number(slotKey.split('-')[1]) - 1;
		return flower.galleryImages[index];
	}

	async function handleUpload(slotKey: 'main' | 'gallery-1' | 'gallery-2' | 'gallery-3', file: File) {
		uploadingSlot = slotKey;
		try {
			const path = await uploadFlowerImage(flower.id, file, slotKey);

			if (slotKey === 'main') {
				await adminUpdateFlowerImage(flower.id, 'mainImage', path);
				flower = { ...flower, mainImage: path };
			} else {
				const index = Number(slotKey.split('-')[1]) - 1;
				const nextGallery = [...flower.galleryImages];
				nextGallery[index] = path;
				await adminUpdateFlowerImage(flower.id, 'galleryImages', nextGallery);
				flower = { ...flower, galleryImages: nextGallery };
			}
			toastStore.success('Image uploaded successfully.');
		} catch (err) {
			toastStore.error(err instanceof StorageServiceError ? err.message : 'Upload failed.');
		} finally {
			uploadingSlot = '';
		}
	}
</script>

<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
	{#each slots as slot}
		<div>
			<div class="aspect-square overflow-hidden rounded-xl bg-cream-100">
				{#await resolveStorageUrl(currentPath(slot.key)) then url}
					<img src={url} alt={slot.label} class="h-full w-full object-cover" />
				{/await}
			</div>
			<label class="btn-secondary mt-2 w-full cursor-pointer justify-center text-xs">
				{uploadingSlot === slot.key ? 'Uploading…' : `Upload ${slot.label}`}
				<input
					type="file"
					accept="image/jpeg,image/png,image/webp,image/avif"
					class="hidden"
					disabled={uploadingSlot !== ''}
					onchange={(e) => {
						const file = (e.target as HTMLInputElement).files?.[0];
						if (file) handleUpload(slot.key, file);
					}}
				/>
			</label>
		</div>
	{/each}
</div>
