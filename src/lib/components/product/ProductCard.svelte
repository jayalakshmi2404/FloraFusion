<script lang="ts">
	import type { Product } from '$lib/types/product';
	import { resolveStorageUrl } from '$lib/utils/storage-url';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();
</script>

<a
	href={`/products/${product.id}`}
	class="group block overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
>
	<div class="relative aspect-square overflow-hidden bg-cream-100">
		{#await resolveStorageUrl(product.mainImage) then url}
			<img
				src={url}
				alt={product.name}
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
			/>
		{/await}
		{#if product.compareAtPrice}
			<span class="absolute left-3 top-3 badge bg-bloom-600 text-white">
				Save ₹{product.compareAtPrice - product.price}
			</span>
		{/if}
		{#if !product.inventory.inStock}
			<span class="absolute right-3 top-3 badge bg-charcoal-800 text-white">Out of Stock</span>
		{/if}
	</div>
	<div class="p-4">
		<p class="text-xs font-medium uppercase tracking-wide text-sage-600">{product.category}</p>
		<h3 class="mt-1 font-display text-lg font-semibold text-charcoal-900">{product.name}</h3>
		<p class="mt-1 text-sm text-charcoal-700">{product.shortDescription}</p>
		<div class="mt-2 flex items-center gap-1 text-sm text-cream-500">
			{#each Array(5) as _, i}
				<span aria-hidden="true">{i < Math.round(product.rating) ? '★' : '☆'}</span>
			{/each}
			<span class="ml-1 text-xs text-charcoal-700">({product.reviewCount})</span>
		</div>
		<div class="mt-3 flex items-baseline gap-2">
			<span class="font-display text-xl font-semibold text-bloom-700">₹{product.price}</span>
			{#if product.compareAtPrice}
				<span class="text-sm text-charcoal-100 line-through">₹{product.compareAtPrice}</span>
			{/if}
		</div>
	</div>
</a>
