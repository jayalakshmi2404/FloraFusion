<script lang="ts">
	import { resolveStorageUrl } from '$lib/utils/storage-url';

	interface Props {
		images: string[];
		altPrefix: string;
	}

	let { images, altPrefix }: Props = $props();
	let activeIndex = $state(0);
</script>

<div>
	<div class="aspect-square overflow-hidden rounded-2xl bg-cream-100">
		{#await resolveStorageUrl(images[activeIndex]) then url}
			<img src={url} alt={`${altPrefix} — view ${activeIndex + 1}`} class="h-full w-full object-cover" />
		{/await}
	</div>
	{#if images.length > 1}
		<div class="mt-3 flex gap-2">
			{#each images as image, i}
				<button
					type="button"
					onclick={() => (activeIndex = i)}
					class={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
						activeIndex === i ? 'border-bloom-600' : 'border-transparent'
					}`}
					aria-label={`View image ${i + 1}`}
					aria-current={activeIndex === i}
				>
					{#await resolveStorageUrl(image) then url}
						<img src={url} alt="" class="h-full w-full object-cover" />
					{/await}
				</button>
			{/each}
		</div>
	{/if}
</div>
