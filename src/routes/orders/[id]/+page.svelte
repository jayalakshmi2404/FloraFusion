<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getOrderById } from '$lib/repositories/order.repository';
	import type { Order } from '$lib/types/product';
	import OrderStatusTracker from '$lib/components/order/OrderStatusTracker.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import { resolveStorageUrl } from '$lib/utils/storage-url';
	import Button from '$lib/components/common/Button.svelte';

	let order = $state<Order | null>(null);
	let loading = $state(true);

	onMount(async () => {
		order = await getOrderById($page.params.id as string);
		loading = false;
	});

	const paymentStatusColor: Record<string, string> = {
		Paid: 'bg-sage-100 text-sage-700',
		Pending: 'bg-cream-500/40 text-charcoal-900',
		Failed: 'bg-red-100 text-red-700'
	};
</script>

<svelte:head>
	<title>Order Details — Flora Fusion</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
	{#if loading}
		<LoadingSpinner fullScreen label="Loading your order" />
	{:else if !order}
		<EmptyState icon="📦" title="Order not found" actionLabel="View My Orders" actionHref="/orders" />
	{:else}
		<div class="rounded-2xl border border-sage-200 bg-sage-50 p-6 text-center">
			<span class="text-4xl" aria-hidden="true">🌸</span>
			<h1 class="mt-2 font-display text-2xl font-semibold text-charcoal-900">
				{order.paymentStatus === 'Paid' ? 'Payment Successful' : 'Order Placed Successfully'}
			</h1>
			<p class="mt-1 text-sm text-charcoal-700">Invoice #{order.invoiceNumber}</p>
			<div class="no-print mt-4">
				<Button variant="secondary" size="sm" onclick={() => window.print()}>
					Print / Download Invoice
				</Button>
			</div>
		</div>

		<div class="mt-8 rounded-2xl border border-charcoal-100 bg-white p-6">
			<h2 class="font-display text-lg font-semibold text-charcoal-900">Manufacturing Progress</h2>
			<div class="mt-6">
				<OrderStatusTracker status={order.orderStatus} />
			</div>
			<p class="mt-6 text-center text-sm text-charcoal-700">
				Estimated delivery: <strong>{new Date(order.estimatedDeliveryDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
			</p>
		</div>

		<div class="mt-6 rounded-2xl border border-charcoal-100 bg-white p-6">
			<h2 class="font-display text-lg font-semibold text-charcoal-900">Items</h2>
			<div class="mt-4 space-y-4">
				{#each order.items as item}
					<div class="flex items-center gap-3">
						<div class="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-100">
							{#await resolveStorageUrl(item.image) then url}
								<img src={url} alt={item.productName} class="h-full w-full object-cover" />
							{/await}
						</div>
						<div class="flex-1">
							<p class="text-sm font-medium text-charcoal-900">{item.productName}</p>
							<p class="text-xs text-charcoal-700">Qty: {item.quantity} × ₹{item.unitPrice}</p>
						</div>
						<p class="text-sm font-semibold text-charcoal-900">₹{item.lineTotal}</p>
					</div>
				{/each}
			</div>

			<dl class="mt-6 space-y-2 border-t border-charcoal-100 pt-4 text-sm">
				<div class="flex justify-between"><dt class="text-charcoal-700">Subtotal</dt><dd>₹{order.subtotal}</dd></div>
				{#if order.discount > 0}
					<div class="flex justify-between text-sage-700">
						<dt>Discount {order.couponCode ? `(${order.couponCode})` : ''}</dt><dd>−₹{order.discount}</dd>
					</div>
				{/if}
				<div class="flex justify-between"><dt class="text-charcoal-700">Tax</dt><dd>₹{order.tax}</dd></div>
				<div class="flex justify-between"><dt class="text-charcoal-700">Shipping</dt><dd>{order.shippingFee === 0 ? 'Free' : `₹${order.shippingFee}`}</dd></div>
				<div class="flex justify-between border-t border-charcoal-100 pt-2 font-display text-base font-semibold text-charcoal-900">
					<dt>Total</dt><dd>₹{order.total}</dd>
				</div>
			</dl>
		</div>

		<div class="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-charcoal-100 bg-white p-6">
			<div>
				<p class="text-sm text-charcoal-700">Payment Method</p>
				<p class="font-medium text-charcoal-900">{order.paymentMethod}</p>
			</div>
			<span class={`badge ${paymentStatusColor[order.paymentStatus]}`}>{order.paymentStatus}</span>
		</div>

		<p class="mt-8 text-center text-sm text-charcoal-700">
			Questions about your order? Contact <a href="mailto:florafusion111@gmail.com" class="text-bloom-600 hover:underline">florafusion111@gmail.com</a>.
		</p>
	{/if}
</div>