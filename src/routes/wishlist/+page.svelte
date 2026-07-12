<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.store';
	import { fetchWishlist, removeProductFromWishlist, WishlistServiceError } from '$lib/services/wishlist.service';
	import { getProductById } from '$lib/repositories/product.repository';
	import { cartStore } from '$lib/stores/cart.store';
	import { toastStore } from '$lib/stores/toast.store';
	import type { WishlistItem } from '$lib/types/product';
	import { resolveStorageUrl } from '$lib/utils/storage-url';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Button from '$lib/components/common/Button.svelte';

	let items = $state<WishlistItem[]>([]);
	let loading = $state(true);
	let removingId = $state('');

	async function load() {
		const uid = $authStore.user?.uid;
		if (!uid) {
			loading = false;
			return;
		}
		loading = true;
		try {
			items = await fetchWishlist(uid);
		} catch (err) {
			toastStore.error(err instanceof WishlistServiceError ? err.message : 'Could not load your wishlist.');
		} finally {
			loading = false;
		}
	}

	onMount(load);

	async function handleRemove(productId: string) {
		const uid = $authStore.user?.uid;
		if (!uid) return;
		removingId = productId;
		try {
			await removeProductFromWishlist(uid, productId);
			items = items.filter((i) => i.productId !== productId);
			toastStore.success('Removed from wishlist.');
		} catch (err) {
			toastStore.error(err instanceof WishlistServiceError ? err.message : 'Could not remove item.');
		} finally {
			removingId = '';
		}
	}

	async function handleMoveToCart(item: WishlistItem) {
		const product = await getProductById(item.productId);
		if (!product) {
			toastStore.error('This keepsake is no longer available.');
			return;
		}
		cartStore.addItem({
			productId: product.id,
			productName: product.name,
			image: product.mainImage,
			price: product.price,
			quantity: 1
		});
		toastStore.success(`${product.name} added to cart.`);
	}
</script>

<svelte:head>
	<title>My Wishlist — Flora Fusion</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
	<h1 class="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">My Wishlist</h1>
	<p class="mt-1 text-charcoal-700">Keepsakes you've saved for later.</p>

	{#if loading}
		<div class="mt-10">
			<LoadingSpinner fullScreen label="Loading your wishlist" />
		</div>
	{:else if items.length === 0}
		<div class="mt-10">
			<EmptyState
				icon="♡"
				title="Your wishlist is empty"
				description="Browse our keepsake catalog and save your favorites for later."
				actionLabel="Browse Keepsakes"
				actionHref="/products"
			/>
		</div>
	{:else}
		<div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each items as item (item.id)}
				<div class="overflow-hidden rounded-2xl border border-charcoal-100 bg-white shadow-sm">
					<a href={`/products/${item.productId}`} class="block aspect-square overflow-hidden bg-cream-100">
						{#await resolveStorageUrl(item.image) then url}
							<img src={url} alt={item.productName} class="h-full w-full object-cover" />
						{/await}
					</a>
					<div class="p-4">
						<a href={`/products/${item.productId}`} class="font-display text-lg font-semibold text-charcoal-900 hover:text-bloom-600">
							{item.productName}
						</a>
						<p class="mt-1 font-display text-xl font-semibold text-bloom-700">₹{item.price}</p>
						<div class="mt-4 flex gap-2">
							<Button variant="primary" size="sm" fullWidth onclick={() => handleMoveToCart(item)}>
								Add to Cart
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => handleRemove(item.productId)}
								loading={removingId === item.productId}
								ariaLabel="Remove from wishlist"
							>
								Remove
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
