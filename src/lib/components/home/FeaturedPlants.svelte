<script lang="ts">
	import { onMount } from 'svelte';
	import { getFeaturedFlowers } from '$lib/repositories/flower.repository';
	import { getAvailableFlowerCount, TOTAL_FLOWER_SLOTS } from '$lib/constants/flowers';
	import type { Flower } from '$lib/types/flower';
	import FlowerCard from '$lib/components/flower/FlowerCard.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import Button from '$lib/components/common/Button.svelte';

	let flowers = $state<Flower[]>([]);
	let loading = $state(true);
	let availableCount = $state(0);

	onMount(async () => {
		flowers = await getFeaturedFlowers(8);
		availableCount = getAvailableFlowerCount(flowers.length ? flowers : []);
		loading = false;
	});
</script>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="featured-heading">
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<h2 id="featured-heading" class="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
				Our Most Loved Blooms
			</h2>
			<p class="mt-2 text-charcoal-700">Hand-selected flowers, ready for preservation.</p>
		</div>
		<span class="badge bg-sage-100 text-sage-700">
			Available Flowers: {getAvailableFlowerCount()} / {TOTAL_FLOWER_SLOTS}
		</span>
	</div>

	{#if loading}
		<div class="mt-10">
			<LoadingSpinner size="lg" fullScreen={false} label="Loading featured flowers" />
		</div>
	{:else}
		<div class="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
			{#each flowers as flower (flower.id)}
				<FlowerCard {flower} />
			{/each}
		</div>
	{/if}

	<div class="mt-10 text-center">
		<Button href="/flowers" variant="secondary" size="lg">View All Flowers</Button>
	</div>
</section>
