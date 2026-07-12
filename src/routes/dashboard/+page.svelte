<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.store';
	import { listUserOrders } from '$lib/repositories/order.repository';
	import { listUserSubmissions } from '$lib/repositories/submission.repository';
	import { getUnreadCount } from '$lib/repositories/notification.repository';
	import type { Order } from '$lib/types/product';
	import type { FlowerSubmission } from '$lib/types/flower';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import BarChart from '$lib/components/dashboard/BarChart.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let orders = $state<Order[]>([]);
	let submissions = $state<FlowerSubmission[]>([]);
	let unreadNotifications = $state(0);
	let loading = $state(true);

	onMount(async () => {
		const uid = $authStore.user?.uid;
		if (uid) {
			[orders, submissions, unreadNotifications] = await Promise.all([
				listUserOrders(uid),
				listUserSubmissions(uid),
				getUnreadCount(uid)
			]);
		}
		loading = false;
	});

	const totalSpent = $derived(orders.reduce((sum, o) => sum + o.total, 0));
	const activeSubmissions = $derived(
		submissions.filter((s) => s.status !== 'Completed' && s.status !== 'Rejected').length
	);

	const spendByMonth = $derived.by(() => {
		const months: Record<string, number> = {};
		const now = new Date();
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const key = d.toLocaleDateString(undefined, { month: 'short' });
			months[key] = 0;
		}
		for (const order of orders) {
			const d = new Date(order.createdAt);
			const key = d.toLocaleDateString(undefined, { month: 'short' });
			if (key in months) months[key] += order.total;
		}
		return Object.entries(months).map(([label, value]) => ({ label, value }));
	});
</script>

<svelte:head>
	<title>Dashboard — Flora Fusion</title>
</svelte:head>

<h1 class="font-display text-3xl font-semibold text-charcoal-900">
	Welcome back{$authStore.profile ? `, ${$authStore.profile.fullName.split(' ')[0]}` : ''}
</h1>
<p class="mt-1 text-charcoal-700">Here's what's happening with your Flora Fusion account.</p>

{#if loading}
	<div class="mt-10">
		<LoadingSpinner fullScreen label="Loading your dashboard" />
	</div>
{:else}
	<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
		<StatCard label="Total Orders" value={orders.length} icon="📦" />
		<StatCard label="Total Spent" value={`₹${totalSpent}`} icon="💰" />
		<StatCard label="Active Submissions" value={activeSubmissions} icon="🌿" />
		<StatCard label="Unread Notifications" value={unreadNotifications} icon="🔔" />
	</div>

	<div class="mt-8 rounded-2xl border border-charcoal-100 bg-white p-6">
		<h2 class="font-display text-lg font-semibold text-charcoal-900">Spending — Last 6 Months</h2>
		<div class="mt-4">
			<BarChart data={spendByMonth} valuePrefix="₹" />
		</div>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
			<div class="flex items-center justify-between">
				<h2 class="font-display text-lg font-semibold text-charcoal-900">Recent Orders</h2>
				<a href="/orders" class="text-sm font-medium text-bloom-600 hover:underline">View all</a>
			</div>
			{#if orders.length === 0}
				<div class="mt-4">
					<EmptyState icon="📦" title="No orders yet" actionLabel="Start Shopping" actionHref="/flowers" />
				</div>
			{:else}
				<div class="mt-4 space-y-3">
					{#each orders.slice(0, 4) as order}
						<a href={`/orders/${order.id}`} class="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-cream-100">
							<div>
								<p class="text-sm font-medium text-charcoal-900">#{order.invoiceNumber}</p>
								<p class="text-xs text-charcoal-700">{order.orderStatus}</p>
							</div>
							<span class="text-sm font-semibold text-bloom-700">₹{order.total}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
			<div class="flex items-center justify-between">
				<h2 class="font-display text-lg font-semibold text-charcoal-900">Recent Submissions</h2>
				<a href="/dashboard/submissions" class="text-sm font-medium text-bloom-600 hover:underline">View all</a>
			</div>
			{#if submissions.length === 0}
				<div class="mt-4">
					<EmptyState icon="🌿" title="No submissions yet" actionLabel="Submit Flowers" actionHref="/submit-flower" />
				</div>
			{:else}
				<div class="mt-4 space-y-3">
					{#each submissions.slice(0, 4) as submission}
						<a href={`/dashboard/submissions/${submission.id}`} class="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-cream-100">
							<div>
								<p class="text-sm font-medium text-charcoal-900">{submission.flowerType}</p>
								<p class="text-xs text-charcoal-700">{submission.occasion}</p>
							</div>
							<span class="badge bg-bloom-100 text-bloom-700">{submission.status}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
