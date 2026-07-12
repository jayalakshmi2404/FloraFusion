<script lang="ts">
	import { uploadFlowerSubmissionPhoto, StorageServiceError } from '$lib/services/storage.service';
	import { authStore } from '$lib/stores/auth.store';

	interface Props {
		photos: string[];
		maxPhotos?: number;
	}

	let { photos = $bindable(), maxPhotos = 10 }: Props = $props();

	let uploading = $state(false);
	let progress = $state(0);
	let error = $state('');
	let dragOver = $state(false);

	async function handleFiles(fileList: FileList | null) {
		if (!fileList || fileList.length === 0) return;
		const uid = $authStore.user?.uid;
		if (!uid) {
			error = 'Please sign in to upload photos.';
			return;
		}

		error = '';
		const files = Array.from(fileList).slice(0, maxPhotos - photos.length);

		for (const file of files) {
			uploading = true;
			progress = 0;
			try {
				const url = await uploadFlowerSubmissionPhoto(uid, file, (percent) => (progress = percent));
				photos = [...photos, url];
			} catch (err) {
				error = err instanceof StorageServiceError ? err.message : 'Failed to upload photo.';
			}
		}
		uploading = false;
	}

	function removePhoto(index: number) {
		photos = photos.filter((_, i) => i !== index);
	}
</script>

<div>
	<div
		role="button"
		tabindex="0"
		ondragover={(e) => {
			e.preventDefault();
			dragOver = true;
		}}
		ondragleave={() => (dragOver = false)}
		ondrop={(e) => {
			e.preventDefault();
			dragOver = false;
			handleFiles(e.dataTransfer?.files ?? null);
		}}
		class={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
			dragOver ? 'border-bloom-500 bg-bloom-50' : 'border-charcoal-100 bg-cream-50'
		}`}
	>
		<span class="text-3xl" aria-hidden="true">📷</span>
		<p class="mt-2 text-sm font-medium text-charcoal-900">Drag photos here or click to upload</p>
		<p class="mt-1 text-xs text-charcoal-700">JPEG, PNG, or WEBP — up to 8MB each</p>
		<label class="btn-secondary mt-4 cursor-pointer text-xs">
			Choose Photos
			<input
				type="file"
				accept="image/jpeg,image/png,image/webp"
				multiple
				class="hidden"
				onchange={(e) => handleFiles((e.target as HTMLInputElement).files)}
			/>
		</label>
	</div>

	{#if uploading}
		<div class="mt-3">
			<div class="h-1.5 w-full overflow-hidden rounded-full bg-charcoal-100">
				<div class="h-full bg-bloom-600 transition-all" style={`width: ${progress}%`}></div>
			</div>
		</div>
	{/if}

	{#if error}<p class="mt-2 text-xs text-red-600" role="alert">{error}</p>{/if}

	{#if photos.length > 0}
		<div class="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
			{#each photos as photo, i}
				<div class="group relative aspect-square overflow-hidden rounded-xl">
					<img src={photo} alt={`Submitted flower photo ${i + 1}`} class="h-full w-full object-cover" />
					<button
						type="button"
						onclick={() => removePhoto(i)}
						class="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal-900/70 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
						aria-label={`Remove photo ${i + 1}`}
					>
						&times;
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>
