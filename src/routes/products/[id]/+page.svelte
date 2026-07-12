<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getProductById } from '$lib/repositories/product.repository';
	import { checkWishlistStatus, toggleWishlistItem, WishlistServiceError } from '$lib/services/wishlist.service';
	import { listUserSubmissions } from '$lib/repositories/submission.repository';
	import type { Product } from '$lib/types/product';
	import type { FlowerSubmission } from '$lib/types/flower';
	import { cartStore } from '$lib/stores/cart.store';
	import { authStore } from '$lib/stores/auth.store';
	import { toastStore } from '$lib/stores/toast.store';
	import ImageGallery from '$lib/components/flower/ImageGallery.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import { trackViewItem, trackAddToCart } from '$lib/services/analytics.service';

	let product = $state<Product | null>(null);
	let loading = $state(true);
	let quantity = $state(1);
	let inWishlist = $state(false);
	let submissions = $state<FlowerSubmission[]>([]);
	let selectedSubmissionId = $state('');
	let customNotes = $state('');

	onMount(async () => {
		const id = $page.params.id as string;
		try {
			product = await getProductById(id);

			if (product) {
				trackViewItem({ id: product.id, name: product.name, category: product.category, price: product.price });
			}

			if ($authStore.user) {
				try {
					inWishlist = await checkWishlistStatus($authStore.user.uid, id);
					submissions = await listUserSubmissions($authStore.user.uid);
				} catch (err) {
					console.error('Failed to load wishlist/submissions:', err);
				}
			}
		} catch (err) {
			console.error('Failed to load product:', err);
			product = null;
		} finally {
			loading = false;
		}
	});

	function addToCart() {
		if (!product) return;
		cartStore.addItem({
			productId: product.id,
			productName: product.name,
			image: product.mainImage,
			price: product.price,
			quantity,
			customization:
				selectedSubmissionId || customNotes
					? { flowerSubmissionId: selectedSubmissionId || undefined, notes: customNotes || undefined }
					: undefined
		});
		trackAddToCart({ id: product.id, name: product.name, price: product.price, quantity });
		toastStore.success(`${product.name} added to cart.`);
	}

	async function handleWishlistToggle() {
		if (!$authStore.user || !product) {
			toastStore.info('Please sign in to save items to your wishlist.');
			return;
		}
		try {
			inWishlist = await toggleWishlistItem($authStore.user.uid, product);
			toastStore.success(inWishlist ? 'Added to wishlist.' : 'Removed from wishlist.');
		} catch (err) {
			toastStore.error(err instanceof WishlistServiceError ? err.message : 'Could not update your wishlist.');
		}
	}
</script>

<svelte:head>
	<title>{product ? `${product.name} — Flora Fusion` : 'Keepsake — Flora Fusion'}</title>
	{#if product}<meta name="description" content={product.shortDescription} />{/if}
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	{#if loading}
		<LoadingSpinner fullScreen label="Loading keepsake" />
	{:else if !product}
		<EmptyState icon="🎁" title="Keepsake not found" actionLabel="Browse Keepsakes" actionHref="/products" />
	{:else}
		<div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
			<ImageGallery images={[product.mainImage, ...product.gallery]} altPrefix={product.name} />

			<div>
				<p class="text-xs font-medium uppercase tracking-wide text-sage-600">{product.category}</p>
				<h1 class="mt-1 font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">{product.name}</h1>

				<div class="mt-3 flex items-center gap-2">
					<div class="flex text-cream-500" aria-label={`Rated ${product.rating} out of 5`}>
						{#each Array(5) as _, i}
							<span aria-hidden="true">{i < Math.round(product.rating) ? '★' : '☆'}</span>
						{/each}
					</div>
					<span class="text-sm text-charcoal-700">({product.reviewCount} reviews)</span>
				</div>

				<div class="mt-5 flex items-baseline gap-3">
					<span class="font-display text-3xl font-semibold text-bloom-700">₹{product.price}</span>
					{#if product.compareAtPrice}
						<span class="text-lg text-charcoal-100 line-through">₹{product.compareAtPrice}</span>
					{/if}
				</div>

				<p class="mt-4 text-charcoal-700">{product.description}</p>

				<dl class="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-charcoal-100 p-5 text-sm">
					<div>
						<dt class="text-charcoal-700">Flower Weight Range</dt>
						<dd class="font-medium text-charcoal-900">{product.minFlowerWeightGrams}g – {product.maxFlowerWeightGrams}g</dd>
					</div>
					<div>
						<dt class="text-charcoal-700">Production Time</dt>
						<dd class="font-medium text-charcoal-900">{product.productionDays} days</dd>
					</div>
					<div>
						<dt class="text-charcoal-700">Workflow</dt>
						<dd class="font-medium text-charcoal-900">{product.workflow}</dd>
					</div>
					<div>
						<dt class="text-charcoal-700">Availability</dt>
						<dd class="font-medium text-charcoal-900">
							{product.inventory.inStock ? `${product.inventory.quantityAvailable} in stock` : 'Out of stock'}
						</dd>
					</div>
				</dl>

				{#if product.isCustomizable}
					<div class="mt-6 rounded-2xl border border-bloom-100 bg-bloom-50 p-5">
						<h2 class="font-display text-lg font-semibold text-charcoal-900">Customize with Your Flowers</h2>
						{#if $authStore.user}
							{#if submissions.length > 0}
								<label for="submission" class="label-text mt-3">Link a flower submission (optional)</label>
								<select id="submission" bind:value={selectedSubmissionId} class="input-field">
									<option value="">Use standard preserved flowers</option>
									{#each submissions as submission}
										<option value={submission.id}>{submission.flowerType} — {submission.occasion}</option>
									{/each}
								</select>
							{:else}
								<p class="mt-2 text-sm text-charcoal-700">
									No flowers submitted yet.
									<a href="/submit-flower" class="font-semibold text-bloom-600 hover:underline">Submit your flowers</a>
									to personalize this keepsake.
								</p>
							{/if}
							<label for="notes" class="label-text mt-3">Special Instructions</label>
							<textarea id="notes" bind:value={customNotes} rows="2" class="input-field" placeholder="Any design preferences…"></textarea>
						{:else}
							<p class="mt-2 text-sm text-charcoal-700">
								<a href="/login" class="font-semibold text-bloom-600 hover:underline">Sign in</a> to customize this keepsake with your own flowers.
							</p>
						{/if}
					</div>
				{/if}

				<div class="mt-8 flex flex-wrap items-center gap-4">
					<div class="flex items-center rounded-full border border-charcoal-100">
						<button type="button" onclick={() => (quantity = Math.max(1, quantity - 1))} class="flex h-10 w-10 items-center justify-center text-lg" aria-label="Decrease quantity">−</button>
						<span class="w-8 text-center text-sm font-medium">{quantity}</span>
						<button type="button" onclick={() => (quantity = Math.min(50, quantity + 1))} class="flex h-10 w-10 items-center justify-center text-lg" aria-label="Increase quantity">+</button>
					</div>
					<Button variant="primary" size="lg" onclick={addToCart} disabled={!product.inventory.inStock}>
						{product.inventory.inStock ? 'Add to Cart' : 'Out of Stock'}
					</Button>
					<Button variant="secondary" size="lg" onclick={handleWishlistToggle}>
						{inWishlist ? '♥ Saved' : '♡ Save'}
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>