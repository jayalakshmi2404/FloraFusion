<script lang="ts">
	import { onMount } from 'svelte';
	import { listFlowers, adminUpdateFlower, seedFlowerIfMissing } from '$lib/repositories/flower.repository';
	import { FLOWERS, getAvailableFlowerCount, TOTAL_FLOWER_SLOTS } from '$lib/constants/flowers';
	import type { Flower } from '$lib/types/flower';
	import { toastStore } from '$lib/stores/toast.store';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import Button from '$lib/components/common/Button.svelte';

	let flowers = $state<Flower[]>([]);
	let loading = $state(true);
	let savingId = $state('');
	let seeding = $state(false);

	async function load() {
		loading = true;
		flowers = await listFlowers();
		loading = false;
	}

	onMount(load);

	async function handleSeed() {
		seeding = true;
		try {
			await Promise.all(FLOWERS.map((f) => seedFlowerIfMissing(f)));
			toastStore.success('Flower catalog seeded to Firestore.');
			await load();
		} catch {
			toastStore.error('Could not seed flowers. Check Firestore permissions.');
		} finally {
			seeding = false;
		}
	}

	async function handleFieldUpdate(flower: Flower, field: 'remainingStock' | 'price', value: number) {
		savingId = flower.id;
		try {
			await adminUpdateFlower(flower.id, { [field]: value });
			flowers = flowers.map((f) => (f.id === flower.id ? { ...f, [field]: value } : f));
			toastStore.success(`${flower.commonName} updated.`);
		} catch {
			toastStore.error('Could not save changes.');
		} finally {
			savingId = '';
		}
	}

	async function handleAvailabilityToggle(flower: Flower) {
		savingId = flower.id;
		try {
			const next = !flower.availability;
			await adminUpdateFlower(flower.id, { availability: next });
			flowers = flowers.map((f) => (f.id === flower.id ? { ...f, availability: next } : f));
		} catch {
			toastStore.error('Could not update availability.');
		} finally {
			savingId = '';
		}
	}
</script>

<svelte:head>
	<title>Flower Inventory — Flora Fusion Admin</title>
</svelte:head>

<div class="flex flex-wrap items-center justify-between gap-3">
	<div>
		<h1 class="font-display text-2xl font-semibold text-charcoal-900">Flower Inventory</h1>
		<p class="mt-1 text-sm text-charcoal-700">
			Available Flowers: {getAvailableFlowerCount(flowers.length ? flowers : FLOWERS)} / {TOTAL_FLOWER_SLOTS}
		</p>
	</div>
	<Button variant="secondary" size="sm" loading={seeding} onclick={handleSeed}>
		Seed Catalog to Firestore
	</Button>
</div>

{#if loading}
	<div class="mt-8">
		<LoadingSpinner fullScreen label="Loading inventory" />
	</div>
{:else}
	<div class="mt-6 overflow-x-auto rounded-2xl border border-charcoal-100 bg-white">
		<table class="w-full min-w-[720px] text-sm">
			<thead>
				<tr class="border-b border-charcoal-100 text-left text-xs uppercase tracking-wide text-charcoal-700">
					<th class="px-4 py-3">Flower</th>
					<th class="px-4 py-3">Category</th>
					<th class="px-4 py-3">Price (₹)</th>
					<th class="px-4 py-3">Stock</th>
					<th class="px-4 py-3">Available</th>
				</tr>
			</thead>
			<tbody>
				{#each flowers as flower (flower.id)}
					<tr class="border-b border-charcoal-100 last:border-none hover:bg-cream-50">
						<td class="px-4 py-3">
							<a href={`/admin/flowers/${flower.id}`} class="font-medium text-charcoal-900 hover:text-bloom-600">
								{flower.commonName}
							</a>
							<p class="text-xs italic text-charcoal-700">{flower.botanicalName}</p>
						</td>
						<td class="px-4 py-3 text-charcoal-700">{flower.category}</td>
						<td class="px-4 py-3">
							<input
								type="number"
								value={flower.price}
								min="0"
								onchange={(e) => handleFieldUpdate(flower, 'price', Number((e.target as HTMLInputElement).value))}
								class="w-24 rounded-lg border border-charcoal-100 px-2 py-1"
								disabled={savingId === flower.id}
							/>
						</td>
						<td class="px-4 py-3">
							<input
								type="number"
								value={flower.remainingStock}
								min="0"
								max={flower.availableStock}
								onchange={(e) => handleFieldUpdate(flower, 'remainingStock', Number((e.target as HTMLInputElement).value))}
								class="w-24 rounded-lg border border-charcoal-100 px-2 py-1"
								disabled={savingId === flower.id}
							/>
							<span class="ml-1 text-xs text-charcoal-700">/ {flower.availableStock}</span>
						</td>
						<td class="px-4 py-3">
							<button
								type="button"
								onclick={() => handleAvailabilityToggle(flower)}
								disabled={savingId === flower.id}
								class={`badge ${flower.availability ? 'bg-sage-100 text-sage-700' : 'bg-charcoal-100 text-charcoal-700'}`}
							>
								{flower.availability ? 'Active' : 'Hidden'}
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
