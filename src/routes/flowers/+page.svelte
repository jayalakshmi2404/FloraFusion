<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { listFlowers } from '$lib/repositories/flower.repository';
	import { getAvailableFlowerCount, TOTAL_FLOWER_SLOTS } from '$lib/constants/flowers';
	import type { Flower, ColorCategory, FlowerCategory, Season } from '$lib/types/flower';
	import FlowerCard from '$lib/components/flower/FlowerCard.svelte';
	import FlowerFilters from '$lib/components/flower/FlowerFilters.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import { trackSearch } from '$lib/services/analytics.service';
	let searchDebounceTimer: ReturnType<typeof setTimeout>;
	let flowers = $state<Flower[]>([]);
	let loading = $state(true);
	let category = $state<FlowerCategory | ''>(
		(($page.url.searchParams.get('category') as FlowerCategory) || '')
	);
	let colorCategory = $state<ColorCategory | ''>('');
	let season = $state<Season | ''>('');
	let maxPrice = $state(1000);
	let searchTerm = $state('');
	async function loadFlowers() {
		loading = true;
		flowers = await listFlowers({
			category: category || undefined,
			colorCategory: colorCategory || undefined,
			season: season || undefined,
			maxPrice,
			searchTerm: searchTerm || undefined
		});
		loading = false;
		if (searchTerm) {
			clearTimeout(searchDebounceTimer);
			searchDebounceTimer = setTimeout(() => trackSearch(searchTerm), 600);
		}
	}
	onMount(loadFlowers);
</script>
<svelte:head>
	<title>Shop Preserved Flowers — Flora Fusion</title>
	<meta
		name="description"
		content="Browse 30 real, professionally preservable botanical varieties ready to become your next keepsake."
	/>
</svelte:head>
<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
		<div>
			<h1 class="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
				Preserved Flowers
			</h1>
			<p class="mt-1 text-charcoal-700">
				30 real, professionally preservable botanical varieties.
			</p>
		</div>

		<span class="badge w-fit bg-sage-100 text-sage-700">
			Available Flowers: {getAvailableFlowerCount()} / {TOTAL_FLOWER_SLOTS}
		</span>
	</div>
	<div class="mt-8 flex flex-col gap-8 lg:flex-row">
		<FlowerFilters
			bind:category
			bind:colorCategory
			bind:season
			bind:maxPrice
			bind:searchTerm
			onFilterChange={loadFlowers}
		/>
		<div class="flex-1">
			{#if loading}
				<div class="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
					{#each Array(8) as _}
						<div class="skeleton aspect-square rounded-2xl"></div>
					{/each}
				</div>
			{:else if flowers.length === 0}
				<EmptyState
					icon="🔍"
					title="No flowers match your filters"
					description="Try adjusting your filters or search term to see more results."	/>
			{:else}
				<p class="mb-4 text-sm text-charcoal-700">
					{flowers.length} flower{flowers.length === 1 ? '' : 's'} found
				</p>

				<div class="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
					{#each flowers as flower (flower.id)}
						<FlowerCard {flower} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>