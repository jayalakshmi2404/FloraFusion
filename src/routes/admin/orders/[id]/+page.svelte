<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getOrderById, updateOrderStatus } from '$lib/repositories/order.repository';
	import { createNotification } from '$lib/repositories/notification.repository';
	import type { Order, OrderStatus } from '$lib/types/product';
	import { toastStore } from '$lib/stores/toast.store';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Button from '$lib/components/common/Button.svelte';

	let order = $state<Order | null>(null);
	let loading = $state(true);
	let updating = $state(false);
	let selectedStatus = $state<OrderStatus>('Confirmed');
	let progress = $state(0);

	const statuses: OrderStatus[] = ['Pending', 'Confirmed', 'In Production', 'Quality Check', 'Shipped', 'Delivered', 'Cancelled'];

	onMount(async () => {
		order = await getOrderById($page.params.id as string);
		if (order) {
			selectedStatus = order.orderStatus;
			progress = order.manufacturingProgress;
		}
		loading = false;
	});

	async function handleUpdate() {
		if (!order) return;
		updating = true;
		try {
			await updateOrderStatus(order.id, selectedStatus, progress);
			await createNotification(
				order.uid,
				'Order Update',
				`Order #${order.invoiceNumber} updated`,
				`Your order status is now "${selectedStatus}".`,
				`/orders/${order.id}`
			);
			order = { ...order, orderStatus: selectedStatus, manufacturingProgress: progress };
			toastStore.success('Order updated and customer notified.');
		} catch {
			toastStore.error('Could not update this order.');
		} finally {
			updating = false;
		}
	}
</script>

<svelte:head>
	<title>Order Details — Flora Fusion Admin</title>
</svelte:head>

{#if loading}
	<LoadingSpinner fullScreen label="Loading order" />
{:else if !order}
	<EmptyState icon="📦" title="Order not found" actionLabel="Back to Orders" actionHref="/admin/orders" />
{:else}
	<h1 class="font-display text-2xl font-semibold text-charcoal-900">Order #{order.invoiceNumber}</h1>
	<p class="mt-1 text-charcoal-700">Placed {new Date(order.createdAt).toLocaleString()}</p>

	<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="rounded-2xl border border-charcoal-100 bg-white p-6 lg:col-span-2">
			<h2 class="font-display text-lg font-semibold text-charcoal-900">Items</h2>
			<div class="mt-4 space-y-3">
				{#each order.items as item}
					<div class="flex items-center justify-between border-b border-charcoal-100 pb-3 last:border-none">
						<div>
							<p class="text-sm font-medium text-charcoal-900">{item.productName}</p>
							<p class="text-xs text-charcoal-700">Qty: {item.quantity} × ₹{item.unitPrice}</p>
						</div>
						<p class="text-sm font-semibold text-charcoal-900">₹{item.lineTotal}</p>
					</div>
				{/each}
			</div>

			<dl class="mt-4 space-y-2 text-sm">
				<div class="flex justify-between"><dt class="text-charcoal-700">Subtotal</dt><dd>₹{order.subtotal}</dd></div>
				<div class="flex justify-between"><dt class="text-charcoal-700">Discount</dt><dd>−₹{order.discount}</dd></div>
				<div class="flex justify-between"><dt class="text-charcoal-700">Tax</dt><dd>₹{order.tax}</dd></div>
				<div class="flex justify-between"><dt class="text-charcoal-700">Shipping</dt><dd>₹{order.shippingFee}</dd></div>
				<div class="flex justify-between border-t border-charcoal-100 pt-2 font-semibold text-charcoal-900"><dt>Total</dt><dd>₹{order.total}</dd></div>
			</dl>

			{#if order.notes}
				<div class="mt-4 rounded-xl bg-cream-50 p-4 text-sm text-charcoal-700">
					<strong>Customer Notes:</strong> {order.notes}
				</div>
			{/if}
		</div>

		<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
			<h2 class="font-display text-lg font-semibold text-charcoal-900">Update Status</h2>

			<label for="status" class="label-text mt-4">Order Status</label>
			<select id="status" bind:value={selectedStatus} class="input-field">
				{#each statuses as status}
					<option value={status}>{status}</option>
				{/each}
			</select>

			<label for="progress" class="label-text mt-4">Manufacturing Progress: {progress}%</label>
			<input id="progress" type="range" min="0" max="100" step="5" bind:value={progress} class="w-full accent-bloom-600" />

			<Button variant="primary" fullWidth loading={updating} onclick={handleUpdate}>
				Save & Notify Customer
			</Button>

			<div class="mt-6 border-t border-charcoal-100 pt-4 text-sm">
				<p class="text-charcoal-700">Payment Method</p>
				<p class="font-medium text-charcoal-900">{order.paymentMethod}</p>
				<p class="mt-2 text-charcoal-700">Payment Status</p>
				<p class="font-medium text-charcoal-900">{order.paymentStatus}</p>
			</div>
		</div>
	</div>
{/if}
