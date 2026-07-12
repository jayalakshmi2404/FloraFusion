<script lang="ts">
	import { goto } from '$app/navigation';
	import { cartStore, cartSubtotal } from '$lib/stores/cart.store';
	import { authStore } from '$lib/stores/auth.store';
	import { calculatePricing } from '$lib/services/pricing.service';
	import { toastStore } from '$lib/stores/toast.store';
	import type { Coupon, PaymentMethod } from '$lib/types/product';
	import CouponInput from '$lib/components/cart/CouponInput.svelte';
	import OrderSummary from '$lib/components/cart/OrderSummary.svelte';
	import PaymentMethodSelector from '$lib/components/checkout/PaymentMethodSelector.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import { resolveStorageUrl } from '$lib/utils/storage-url';
	import { onMount } from 'svelte';
	import { trackBeginCheckout, trackPurchase } from '$lib/services/analytics.service';

	let appliedCoupon = $state<Coupon | null>(null);
	let paymentMethod = $state<PaymentMethod>('UPI');
	let notes = $state('');
	let placing = $state(false);
	let formError = $state('');

	const pricing = $derived(calculatePricing($cartSubtotal, appliedCoupon));

	onMount(() => {
		if ($cartStore.length > 0) {
			trackBeginCheckout(
				$cartStore.reduce((sum, i) => sum + i.price * i.quantity, 0),
				$cartStore.length
			);
		}
	});

	async function handlePlaceOrder() {
		formError = '';

		if ($cartStore.length === 0) {
			formError = 'Your cart is empty.';
			return;
		}

		placing = true;
		try {
			const response = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: $cartStore.map((item) => ({ productId: item.productId, quantity: item.quantity })),
					couponCode: appliedCoupon?.code ?? null,
					paymentMethod,
					notes: notes || null
				})
			});

			const data = await response.json();

			if (!response.ok) {
				formError = data.error ?? 'Something went wrong while placing your order.';
				return;
			}

			cartStore.clear();
			trackPurchase({
				orderId: data.orderId,
				total: data.total,
				tax: pricing.tax,
				shipping: pricing.shippingFee,
				coupon: appliedCoupon?.code ?? null
			});
			toastStore.success(data.message);
			await goto(`/orders/${data.orderId}`);
		} catch {
			formError = 'Network error. Please check your connection and try again.';
		} finally {
			placing = false;
		}
	}
</script>

<svelte:head>
	<title>Checkout — Flora Fusion</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
	<h1 class="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">Checkout</h1>

	{#if $cartStore.length === 0}
		<div class="mt-10">
			<EmptyState icon="🛒" title="Your cart is empty" actionLabel="Browse Flowers" actionHref="/flowers" />
		</div>
	{:else}
		<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
			<div class="space-y-6 lg:col-span-2">
				<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
					<h2 class="font-display text-lg font-semibold text-charcoal-900">Order Items</h2>
					<div class="mt-4 space-y-4">
						{#each $cartStore as item (item.id)}
							<div class="flex items-center gap-3">
								<div class="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-100">
									{#await resolveStorageUrl(item.image) then url}
										<img src={url} alt={item.productName} class="h-full w-full object-cover" />
									{/await}
								</div>
								<div class="flex-1">
									<p class="text-sm font-medium text-charcoal-900">{item.productName}</p>
									<p class="text-xs text-charcoal-700">Qty: {item.quantity}</p>
								</div>
								<p class="text-sm font-semibold text-charcoal-900">₹{item.price * item.quantity}</p>
							</div>
						{/each}
					</div>
				</div>

				<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
					<h2 class="font-display text-lg font-semibold text-charcoal-900">Payment Method</h2>
					<div class="mt-4">
						<PaymentMethodSelector value={paymentMethod} onChange={(m) => (paymentMethod = m)} />
					</div>
				</div>

				<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
					<label for="orderNotes" class="label-text">Order Notes (optional)</label>
					<textarea
						id="orderNotes"
						bind:value={notes}
						rows="3"
						class="input-field"
						placeholder="Any special instructions for your order…"
					></textarea>
				</div>
			</div>

			<div class="space-y-6">
				<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
					<h2 class="font-display text-lg font-semibold text-charcoal-900">Have a coupon?</h2>
					<div class="mt-3">
						<CouponInput subtotal={$cartSubtotal} bind:appliedCoupon onApply={(c) => (appliedCoupon = c)} />
					</div>
				</div>

				<OrderSummary {pricing} couponCode={appliedCoupon?.code} />

				{#if formError}
					<div class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</div>
				{/if}

				<Button variant="primary" size="lg" fullWidth loading={placing} onclick={handlePlaceOrder}>
					Place Order
				</Button>

				<p class="text-center text-xs text-charcoal-700">
					By placing your order, you agree to our terms. Need help? Contact
					<a href="mailto:florafusion111@gmail.com" class="text-bloom-600 hover:underline">florafusion111@gmail.com</a>.
				</p>
			</div>
		</div>
	{/if}
</div>