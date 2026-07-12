<script lang="ts">
	import { onMount } from 'svelte';
	import { listAllOrders } from '$lib/repositories/order.repository';
	import { listAllSubmissions } from '$lib/repositories/submission.repository';
	import { listAllCustomers } from '$lib/repositories/admin-customer.repository';
	import { getAvailableFlowerCount, TOTAL_FLOWER_SLOTS } from '$lib/constants/flowers';
	import type { Order } from '$lib/types/product';
	import type { FlowerSubmission } from '$lib/types/flower';
	import type { UserProfile } from '$lib/types/user';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import BarChart from '$lib/components/dashboard/BarChart.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';

	let orders = $state<Order[]>([]);
	let submissions = $state<FlowerSubmission[]>([]);
	let customers = $state<UserProfile[]>([]);
	let loading = $state(true);

	onMount(async () => {
		[orders, submissions, customers] = await Promise.all([
			listAllOrders(),
			listAllSubmissions(),
			listAllCustomers()
		]);
		loading = false;
	});

	const totalRevenue = $derived(orders.filter((o) => o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0));
	const pendingOrders = $derived(orders.filter((o) => o.orderStatus === 'Confirmed' || o.orderStatus === 'In Production').length);
	const pendingSubmissions = $derived(submissions.filter((s) => s.status === 'Submitted' || s.status === 'Under Review').length);

	const revenueByMonth = $derived.by(() => {
		const months: Record<string, number> = {};
		const now = new Date();
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			months[d.toLocaleDateString(undefined, { month: 'short' })] = 0;
		}
		for (const order of orders) {
			if (order.paymentStatus !== 'Paid') continue;
			const key = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short' });
			if (key in months) months[key] += order.total;
		}
		return Object.entries(months).map(([label, value]) => ({ label, value }));
	});

	const ordersByStatus = $derived.by(() => {
		const counts: Record<string, number> = {};
		for (const order of orders) counts[order.orderStatus] = (counts[order.orderStatus] ?? 0) + 1;
		return Object.entries(counts).map(([label, value]) => ({ label, value }));
	});
</script>

<svelte:head>
	<title>Admin Dashboard — Flora Fusion</title>
</svelte:head>

<h1 class="font-display text-2xl font-semibold text-charcoal-900">Admin Overview</h1>
<p class="mt-1 text-charcoal-700">A snapshot of Flora Fusion's performance.</p>

{#if loading}
	<div class="mt-10">
		<LoadingSpinner fullScreen label="Loading admin analytics" />
	</div>
{:else}
	<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
		<StatCard label="Total Revenue" value={`₹${totalRevenue}`} icon="💰" />
		<StatCard label="Total Orders" value={orders.length} icon="📦" />
		<StatCard label="Pending Orders" value={pendingOrders} icon="⏳" />
		<StatCard label="Customers" value={customers.length} icon="👥" />
		<StatCard label="Flowers In Stock" value={`${getAvailableFlowerCount()} / ${TOTAL_FLOWER_SLOTS}`} icon="🌸" />
	</div>

	<div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
			<h2 class="font-display text-lg font-semibold text-charcoal-900">Revenue — Last 6 Months</h2>
			<div class="mt-4">
				<BarChart data={revenueByMonth} valuePrefix="₹" color="#cf4a7c" />
			</div>
		</div>
		<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
			<h2 class="font-display text-lg font-semibold text-charcoal-900">Orders by Status</h2>
			<div class="mt-4">
				<BarChart data={ordersByStatus} color="#5f884f" />
			</div>
		</div>
	</div>

	<div class="mt-8 rounded-2xl border border-charcoal-100 bg-white p-6">
		<h2 class="font-display text-lg font-semibold text-charcoal-900">Pending Flower Submissions</h2>
		<p class="mt-1 text-sm text-charcoal-700">{pendingSubmissions} submission{pendingSubmissions === 1 ? '' : 's'} awaiting review.</p>
		<a href="/admin/manufacturing" class="mt-3 inline-block text-sm font-medium text-bloom-600 hover:underline">Review submissions →</a>
	</div>
{/if}
