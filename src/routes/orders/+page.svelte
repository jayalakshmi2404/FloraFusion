<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.store';
	import { listUserOrders } from '$lib/repositories/order.repository';
	import type { Order } from '$lib/types/product';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let orders = $state<Order[]>([]);
	let loading = $state(true);

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
		const uid = $authStore.user?.uid;
		if (uid) {
			orders = await listUserOrders(uid);
		}
		loading = false;
	});
</script>

<svelte:head>
	<title>My Orders — Flora Fusion</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
	<h1 class="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">My Orders</h1>
	<p class="mt-1 text-charcoal-700">Track and review your past Flora Fusion orders.</p>

	{#if loading}
		<div class="mt-10">
			<LoadingSpinner fullScreen label="Loading your orders" />
		</div>
	{:else if orders.length === 0}
		<div class="mt-10">
			<EmptyState icon="📦" title="No orders yet" description="Once you place an order, it will show up here." actionLabel="Start Shopping" actionHref="/flowers" />
		</div>
	{:else}
		<div class="mt-8 space-y-4">
			{#each orders as order (order.id)}
				<a
					href={`/orders/${order.id}`}
					class="flex flex-col gap-3 rounded-2xl border border-charcoal-100 bg-white p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
				>
					<div>
						<p class="font-semibold text-charcoal-900">Invoice #{order.invoiceNumber}</p>
						<p class="text-sm text-charcoal-700">
							{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
							· {order.items.length} item{order.items.length === 1 ? '' : 's'}
						</p>
					</div>
					<div class="flex items-center gap-3">
						<span class={`badge ${statusColor[order.orderStatus]}`}>{order.orderStatus}</span>
						<span class="font-display text-lg font-semibold text-bloom-700">₹{order.total}</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
