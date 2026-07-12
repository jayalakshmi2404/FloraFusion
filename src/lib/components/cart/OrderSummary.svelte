<script lang="ts">
	import type { PricingBreakdown } from '$lib/services/pricing.service';
	import { FREE_SHIPPING_THRESHOLD } from '$lib/services/pricing.service';

	interface Props {
		pricing: PricingBreakdown;
		couponCode?: string | null;
	}

	let { pricing, couponCode = null }: Props = $props();
</script>

<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
	<h2 class="font-display text-lg font-semibold text-charcoal-900">Order Summary</h2>

	<dl class="mt-4 space-y-3 text-sm">
		<div class="flex justify-between">
			<dt class="text-charcoal-700">Subtotal</dt>
			<dd class="font-medium text-charcoal-900">₹{pricing.subtotal}</dd>
		</div>
		{#if pricing.discount > 0}
			<div class="flex justify-between text-sage-700">
				<dt>Discount {couponCode ? `(${couponCode})` : ''}</dt>
				<dd class="font-medium">−₹{pricing.discount}</dd>
			</div>
		{/if}
		<div class="flex justify-between">
			<dt class="text-charcoal-700">Tax (5% GST)</dt>
			<dd class="font-medium text-charcoal-900">₹{pricing.tax}</dd>
		</div>
		<div class="flex justify-between">
			<dt class="text-charcoal-700">Shipping</dt>
			<dd class="font-medium text-charcoal-900">
				{pricing.shippingFee === 0 ? 'Free' : `₹${pricing.shippingFee}`}
			</dd>
		</div>
	</dl>

	{#if pricing.shippingFee > 0}
		<p class="mt-3 text-xs text-charcoal-700">
			Add ₹{FREE_SHIPPING_THRESHOLD - pricing.taxableAmount} more to unlock free shipping.
		</p>
	{/if}

	<div class="mt-4 flex justify-between border-t border-charcoal-100 pt-4">
		<span class="font-display text-lg font-semibold text-charcoal-900">Total</span>
		<span class="font-display text-lg font-semibold text-bloom-700">₹{pricing.total}</span>
	</div>
</div>
