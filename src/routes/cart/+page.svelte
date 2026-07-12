<script lang="ts">
	import { cartStore, cartSubtotal } from '$lib/stores/cart.store';
	import { calculatePricing } from '$lib/services/pricing.service';
	import type { Coupon } from '$lib/types/product';
	import CartLineItem from '$lib/components/cart/CartLineItem.svelte';
	import CouponInput from '$lib/components/cart/CouponInput.svelte';
	import OrderSummary from '$lib/components/cart/OrderSummary.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Button from '$lib/components/common/Button.svelte';

	let appliedCoupon = $state<Coupon | null>(null);

	const pricing = $derived(calculatePricing($cartSubtotal, appliedCoupon));
</script>

<svelte:head>
	<title>Your Cart — Flora Fusion</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
	<h1 class="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">Your Cart</h1>

	{#if $cartStore.length === 0}
		<div class="mt-10">
			<EmptyState
				icon="🛒"
				title="Your cart is empty"
				description="Explore our preserved flowers and keepsakes to get started."
				actionLabel="Browse Flowers"
				actionHref="/flowers"
			/>
		</div>
	{:else}
		<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
			<div class="rounded-2xl border border-charcoal-100 bg-white p-6 lg:col-span-2">
				{#each $cartStore as item (item.id)}
					<CartLineItem {item} />
				{/each}
			</div>

			<div class="space-y-6">
				<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
					<h2 class="font-display text-lg font-semibold text-charcoal-900">Have a coupon?</h2>
					<div class="mt-3">
						<CouponInput subtotal={$cartSubtotal} bind:appliedCoupon onApply={(c) => (appliedCoupon = c)} />
					</div>
				</div>

				<OrderSummary {pricing} couponCode={appliedCoupon?.code} />

				<Button href="/checkout" variant="primary" size="lg" fullWidth>
					Proceed to Checkout
				</Button>
			</div>
		</div>
	{/if}
</div>
