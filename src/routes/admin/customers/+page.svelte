<script lang="ts">
	import { onMount } from 'svelte';
	import { listAllCustomers } from '$lib/repositories/admin-customer.repository';
	import type { UserProfile } from '$lib/types/user';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let customers = $state<UserProfile[]>([]);
	let loading = $state(true);
	let searchTerm = $state('');

	onMount(async () => {
		customers = await listAllCustomers();
		loading = false;
	});

	const filtered = $derived(
		searchTerm
			? customers.filter(
					(c) =>
						c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
						c.email.toLowerCase().includes(searchTerm.toLowerCase())
				)
			: customers
	);
</script>

<svelte:head>
	<title>Customers — Flora Fusion Admin</title>
</svelte:head>

<div class="flex flex-wrap items-center justify-between gap-3">
	<h1 class="font-display text-2xl font-semibold text-charcoal-900">Customers</h1>
	<input type="search" bind:value={searchTerm} placeholder="Search by name or email…" class="input-field max-w-xs" />
</div>

{#if loading}
	<div class="mt-8">
		<LoadingSpinner fullScreen label="Loading customers" />
	</div>
{:else if filtered.length === 0}
	<div class="mt-8">
		<EmptyState icon="👥" title="No customers found" />
	</div>
{:else}
	<div class="mt-6 overflow-x-auto rounded-2xl border border-charcoal-100 bg-white">
		<table class="w-full min-w-[640px] text-sm">
			<thead>
				<tr class="border-b border-charcoal-100 text-left text-xs uppercase tracking-wide text-charcoal-700">
					<th class="px-4 py-3">Name</th>
					<th class="px-4 py-3">Email</th>
					<th class="px-4 py-3">Orders</th>
					<th class="px-4 py-3">Wishlist</th>
					<th class="px-4 py-3">Joined</th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as customer (customer.uid)}
					<tr class="border-b border-charcoal-100 last:border-none hover:bg-cream-50">
						<td class="px-4 py-3 font-medium text-charcoal-900">{customer.fullName}</td>
						<td class="px-4 py-3 text-charcoal-700">{customer.email}</td>
						<td class="px-4 py-3 text-charcoal-700">{customer.ordersCount}</td>
						<td class="px-4 py-3 text-charcoal-700">{customer.wishlistCount}</td>
						<td class="px-4 py-3 text-charcoal-700">{new Date(customer.createdAt).toLocaleDateString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
