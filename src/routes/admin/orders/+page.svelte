<script lang="ts">
	import { onMount } from 'svelte';
	import { listAllOrders } from '$lib/repositories/order.repository';
	import type { Order, OrderStatus } from '$lib/types/product';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let orders = $state<Order[]>([]);
	let loading = $state(true);
	let statusFilter = $state<OrderStatus | 'All'>('All');

	const statuses: (OrderStatus | 'All')[] = [
		'All',
		'Pending',
		'Confirmed',
		'In Production',
		'Quality Check',
		'Shipped',
		'Delivered',
		'Cancelled'
	];

	const statusColor: Record<string, string> = {
		Pending: 'bg-cream-500/40 text-charcoal-900',
		Confirmed: 'bg-bloom-100 text-bloom-700',
		'In Production': 'bg-bloom-100 text-bloom-700',
		'Quality Check': 'bg-cream-500/40 text-charcoal-900',
		Shipped: 'bg-sage-100 text-sage-700',
		Delivered: 'bg-sage-200 text-sage-800',
		Cancelled: 'bg-red-100 text-red-700'
	};

	onMount(async () => {
		orders = await listAllOrders();
		loading = false;
	});

	const filteredOrders = $derived(statusFilter === 'All' ? orders : orders.filter((o) => o.orderStatus === statusFilter));
</script>

<svelte:head>
	<title>Manage Orders — Flora Fusion Admin</title>
</svelte:head>

<div class="flex items-center justify-between">
	<h1 class="font-display text-2xl font-semibold text-charcoal-900">Orders</h1>
	<span class="text-sm text-charcoal-700">{orders.length} total</span>
</div>

<div class="mt-4 flex flex-wrap gap-2">
	{#each statuses as status}
		<button
			type="button"
			onclick={() => (statusFilter = status)}
			class={`badge border ${statusFilter === status ? 'border-bloom-600 bg-bloom-600 text-white' : 'border-charcoal-100 text-charcoal-700'}`}
		>
			{status}
		</button>
	{/each}
</div>

{#if loading}
	<div class="mt-8">
		<LoadingSpinner fullScreen label="Loading orders" />
	</div>
{:else if filteredOrders.length === 0}
	<div class="mt-8">
		<EmptyState icon="📦" title="No orders found" description="No orders match this status filter." />
	</div>
{:else}
	<div class="mt-6 overflow-x-auto rounded-2xl border border-charcoal-100 bg-white">
		<table class="w-full min-w-[640px] text-sm">
			<thead>
				<tr class="border-b border-charcoal-100 text-left text-xs uppercase tracking-wide text-charcoal-700">
					<th class="px-4 py-3">Invoice</th>
					<th class="px-4 py-3">Date</th>
					<th class="px-4 py-3">Items</th>
					<th class="px-4 py-3">Total</th>
					<th class="px-4 py-3">Payment</th>
					<th class="px-4 py-3">Status</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredOrders as order (order.id)}
					<tr class="border-b border-charcoal-100 last:border-none hover:bg-cream-50">
						<td class="px-4 py-3">
							<a href={`/admin/orders/${order.id}`} class="font-medium text-bloom-600 hover:underline">#{order.invoiceNumber}</a>
						</td>
						<td class="px-4 py-3 text-charcoal-700">{new Date(order.createdAt).toLocaleDateString()}</td>
						<td class="px-4 py-3 text-charcoal-700">{order.items.length}</td>
						<td class="px-4 py-3 font-medium text-charcoal-900">₹{order.total}</td>
						<td class="px-4 py-3 text-charcoal-700">{order.paymentMethod}</td>
						<td class="px-4 py-3"><span class={`badge ${statusColor[order.orderStatus]}`}>{order.orderStatus}</span></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
