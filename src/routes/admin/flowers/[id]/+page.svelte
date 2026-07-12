<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getFlowerById, adminUpdateFlower } from '$lib/repositories/flower.repository';
	import type { Flower } from '$lib/types/flower';
	import { toastStore } from '$lib/stores/toast.store';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import FlowerImageUploader from '$lib/components/admin/FlowerImageUploader.svelte';

	let flower = $state<Flower | null>(null);
	let loading = $state(true);
	let saving = $state(false);

	let description = $state('');
	let price = $state(0);
	let availableStock = $state(0);
	let remainingStock = $state(0);

	onMount(async () => {
		flower = await getFlowerById($page.params.id as string);
		if (flower) {
			description = flower.description;
			price = flower.price;
			availableStock = flower.availableStock;
			remainingStock = flower.remainingStock;
		}
		loading = false;
	});

	async function handleSave() {
		if (!flower) return;
		saving = true;
		try {
			await adminUpdateFlower(flower.id, { description, price, availableStock, remainingStock });
			flower = { ...flower, description, price, availableStock, remainingStock };
			toastStore.success('Flower details updated.');
		} catch {
			toastStore.error('Could not save changes.');
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>{flower ? `Edit ${flower.commonName}` : 'Edit Flower'} — Flora Fusion Admin</title>
</svelte:head>

{#if loading}
	<LoadingSpinner fullScreen label="Loading flower" />
{:else if !flower}
	<EmptyState icon="🌸" title="Flower not found" actionLabel="Back to Flowers" actionHref="/admin/flowers" />
{:else}
	<h1 class="font-display text-2xl font-semibold text-charcoal-900">{flower.commonName}</h1>
	<p class="italic text-charcoal-700">{flower.botanicalName}</p>

	<div class="mt-6 rounded-2xl border border-charcoal-100 bg-white p-6">
		<h2 class="font-display text-lg font-semibold text-charcoal-900">Photography</h2>
		<div class="mt-4">
			<FlowerImageUploader bind:flower />
		</div>
	</div>

	<div class="mt-6 rounded-2xl border border-charcoal-100 bg-white p-6">
		<h2 class="font-display text-lg font-semibold text-charcoal-900">Details</h2>

		<label for="description" class="label-text mt-4">Description</label>
		<textarea id="description" bind:value={description} rows="4" class="input-field"></textarea>

		<div class="mt-4 grid grid-cols-3 gap-4">
			<div>
				<label for="price" class="label-text">Price (₹)</label>
				<input id="price" type="number" min="0" bind:value={price} class="input-field" />
			</div>
			<div>
				<label for="availableStock" class="label-text">Total Stock</label>
				<input id="availableStock" type="number" min="0" bind:value={availableStock} class="input-field" />
			</div>
			<div>
				<label for="remainingStock" class="label-text">Remaining Stock</label>
				<input id="remainingStock" type="number" min="0" max={availableStock} bind:value={remainingStock} class="input-field" />
			</div>
		</div>

		<Button variant="primary" loading={saving} onclick={handleSave}>
			Save Changes
		</Button>
	</div>
{/if}
