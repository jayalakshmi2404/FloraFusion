<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { listProducts } from '$lib/repositories/product.repository';
	import { PRODUCT_CATEGORIES } from '$lib/constants/products';
	import type { Product } from '$lib/types/product';
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let products = $state<Product[]>([]);
	let loading = $state(true);
	let category = $state($page.url.searchParams.get('category') ?? '');
	let searchTerm = $state('');

	async function load() {
		loading = true;
		products = await listProducts({ category: category || undefined, searchTerm: searchTerm || undefined });
		loading = false;
	}

	onMount(load);
</script>

<svelte:head>
	<title>Shop Keepsakes — Flora Fusion</title>
	<meta name="description" content="25 handcrafted keepsake products to preserve your flowers — resin frames, jewelry, keepsake boxes, and more." />
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<h1 class="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">Keepsakes</h1>
	<p class="mt-1 text-charcoal-700">Handcrafted pieces that turn preserved flowers into lasting art.</p>

	<div class="mt-6 flex flex-wrap items-center gap-3">
		<input
			type="search"
			bind:value={searchTerm}
			oninput={load}
			placeholder="Search keepsakes…"
			class="input-field max-w-xs"
		/>
		<button
			type="button"
			onclick={() => {
				category = '';
				load();
			}}
			class={`badge border ${category === '' ? 'border-bloom-600 bg-bloom-600 text-white' : 'border-charcoal-100 text-charcoal-700'}`}
		>
			All
		</button>
		{#each PRODUCT_CATEGORIES as cat}
			<button
				type="button"
				onclick={() => {
					category = cat;
					load();
				}}
				class={`badge border ${category === cat ? 'border-bloom-600 bg-bloom-600 text-white' : 'border-charcoal-100 text-charcoal-700'}`}
			>
				{cat}
			</button>
		{/each}
	</div>

	<div class="mt-8">
		{#if loading}
			<div class="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
				{#each Array(8) as _}
					<div class="skeleton aspect-square rounded-2xl"></div>
				{/each}
			</div>
		{:else if products.length === 0}
			<EmptyState icon="🎁" title="No keepsakes match your search" description="Try a different category or search term." />
		{:else}
			<p class="mb-4 text-sm text-charcoal-700">{products.length} keepsake{products.length === 1 ? '' : 's'}</p>
			<div class="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
				{#each products as product (product.id)}
					<ProductCard {product} />
				{/each}
			</div>
		{/if}
	</div>
</div>
