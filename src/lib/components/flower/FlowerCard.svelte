<script lang="ts">
	import type { Flower } from '$lib/types/flower';
	import { resolveStorageUrl } from '$lib/utils/storage-url';

	interface Props {
		flower: Flower;
	}

	let { flower }: Props = $props();
</script>

<a
	href={`/flowers/${flower.id}`}
	class="group block overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
	<div class="relative aspect-square overflow-hidden bg-cream-100">

		{#await resolveStorageUrl(flower.mainImage) then url}

			<img
				src={url}
				alt={`${flower.commonName} (${flower.botanicalName}) preserved flower`}
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
			/>

		{:catch}

			<img
				src="/images/flower-placeholder.svg"
				alt={flower.commonName}
				class="h-full w-full object-cover"
			/>

		{/await}

		{#if flower.remainingStock <= 0}
			<span class="absolute left-3 top-3 badge bg-charcoal-800 text-white">
				Sold Out
			</span>
		{:else if flower.remainingStock < 20}
			<span class="absolute left-3 top-3 badge bg-cream-500 text-charcoal-900">
				Low Stock
			</span>
		{/if}

		<span class="absolute right-3 top-3 badge bg-white/90 text-charcoal-900">
			{flower.colorCategory}
		</span>

	</div>

	<div class="p-4">
		<h3 class="font-display text-lg font-semibold text-charcoal-900">
			{flower.commonName}
		</h3>

		<p class="italic text-xs text-charcoal-700">
			{flower.botanicalName}
		</p>

		<div
			class="mt-2 flex items-center gap-1 text-sm text-cream-500"
			aria-label={`Rated ${flower.rating} out of 5`}
		>
			{#each Array(5) as _, i}
				<span>{i < Math.round(flower.rating) ? '★' : '☆'}</span>
			{/each}

			<span class="ml-1 text-xs text-charcoal-700">
				({flower.rating.toFixed(1)})
			</span>
		</div>

		<div class="mt-3 flex items-center justify-between">
			<span class="font-display text-xl font-semibold text-bloom-700">
				₹{flower.price}
			</span>

			<span class="text-xs text-charcoal-700">
				{flower.expectedPreservedLife}
			</span>
		</div>
	</div>
</a>