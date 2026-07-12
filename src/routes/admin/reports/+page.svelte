<script lang="ts">
	import { onMount } from 'svelte';
	import { listAllOrders } from '$lib/repositories/order.repository';
	import { listAllSubmissions } from '$lib/repositories/submission.repository';
	import { listAllCustomers } from '$lib/repositories/admin-customer.repository';
	import { exportToCsv } from '$lib/utils/csv-export';
	import type { Order } from '$lib/types/product';
	import type { FlowerSubmission } from '$lib/types/flower';
	import type { UserProfile } from '$lib/types/user';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import Button from '$lib/components/common/Button.svelte';

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
	const totalTaxCollected = $derived(orders.reduce((sum, o) => sum + o.tax, 0));
	const totalDiscountsGiven = $derived(orders.reduce((sum, o) => sum + o.discount, 0));
	const averageOrderValue = $derived(orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0);

	function exportOrdersReport() {
		exportToCsv(
			`flora-fusion-orders-${new Date().toISOString().slice(0, 10)}.csv`,
			orders.map((o) => ({
				InvoiceNumber: o.invoiceNumber,
				Date: new Date(o.createdAt).toLocaleDateString(),
				Items: o.items.length,
				Subtotal: o.subtotal,
				Discount: o.discount,
				Tax: o.tax,
				Shipping: o.shippingFee,
				Total: o.total,
				PaymentMethod: o.paymentMethod,
				PaymentStatus: o.paymentStatus,
				OrderStatus: o.orderStatus
			}))
		);
	}

	function exportSubmissionsReport() {
		exportToCsv(
			`flora-fusion-submissions-${new Date().toISOString().slice(0, 10)}.csv`,
			submissions.map((s) => ({
				FlowerType: s.flowerType,
				Occasion: s.occasion,
				WeightGrams: s.flowerWeightGrams,
				Status: s.status,
				SubmittedOn: new Date(s.createdAt).toLocaleDateString(),
				EstimatedCost: s.weightEngineResult?.estimatedCost ?? 0
			}))
		);
	}

	function exportCustomersReport() {
		exportToCsv(
			`flora-fusion-customers-${new Date().toISOString().slice(0, 10)}.csv`,
			customers.map((c) => ({
				Name: c.fullName,
				Email: c.email,
				OrdersCount: c.ordersCount,
				WishlistCount: c.wishlistCount,
				JoinedOn: new Date(c.createdAt).toLocaleDateString()
			}))
		);
	}
</script>

<svelte:head>
	<title>Reports — Flora Fusion Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-semibold text-charcoal-900">Reports</h1>
<p class="mt-1 text-sm text-charcoal-700">Export business data for accounting and analysis.</p>

{#if loading}
	<div class="mt-8">
		<LoadingSpinner fullScreen label="Compiling reports" />
	</div>
{:else}
	<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
		<div class="rounded-2xl border border-charcoal-100 bg-white p-5">
			<p class="text-sm text-charcoal-700">Total Revenue</p>
			<p class="mt-1 font-display text-2xl font-semibold text-bloom-700">₹{totalRevenue}</p>
		</div>
		<div class="rounded-2xl border border-charcoal-100 bg-white p-5">
			<p class="text-sm text-charcoal-700">Tax Collected</p>
			<p class="mt-1 font-display text-2xl font-semibold text-charcoal-900">₹{totalTaxCollected}</p>
		</div>
		<div class="rounded-2xl border border-charcoal-100 bg-white p-5">
			<p class="text-sm text-charcoal-700">Discounts Given</p>
			<p class="mt-1 font-display text-2xl font-semibold text-charcoal-900">₹{totalDiscountsGiven}</p>
		</div>
		<div class="rounded-2xl border border-charcoal-100 bg-white p-5">
			<p class="text-sm text-charcoal-700">Avg. Order Value</p>
			<p class="mt-1 font-display text-2xl font-semibold text-charcoal-900">₹{averageOrderValue}</p>
		</div>
	</div>

	<div class="mt-8 space-y-4">
		<div class="flex items-center justify-between rounded-2xl border border-charcoal-100 bg-white p-5">
			<div>
				<p class="font-semibold text-charcoal-900">Orders Report</p>
				<p class="text-sm text-charcoal-700">{orders.length} orders — full financial breakdown per order.</p>
			</div>
			<Button variant="secondary" size="sm" onclick={exportOrdersReport}>Export CSV</Button>
		</div>

		<div class="flex items-center justify-between rounded-2xl border border-charcoal-100 bg-white p-5">
			<div>
				<p class="font-semibold text-charcoal-900">Flower Submissions Report</p>
				<p class="text-sm text-charcoal-700">{submissions.length} submissions — status and weight engine estimates.</p>
			</div>
			<Button variant="secondary" size="sm" onclick={exportSubmissionsReport}>Export CSV</Button>
		</div>

		<div class="flex items-center justify-between rounded-2xl border border-charcoal-100 bg-white p-5">
			<div>
				<p class="font-semibold text-charcoal-900">Customers Report</p>
				<p class="text-sm text-charcoal-700">{customers.length} registered customers.</p>
			</div>
			<Button variant="secondary" size="sm" onclick={exportCustomersReport}>Export CSV</Button>
		</div>
	</div>
{/if}
