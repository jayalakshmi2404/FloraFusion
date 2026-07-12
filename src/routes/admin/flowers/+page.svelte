<script lang="ts">
	import { onMount } from 'svelte';
	import { listFlowers } from '$lib/repositories/flower.repository';
	import type { Flower } from '$lib/types/flower';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import { resolveStorageUrl } from '$lib/utils/storage-url';

	let flowers = $state<Flower[]>([]);
	let loading = $state(true);

	onMount(async () => {
		flowers = await listFlowers();
		loading = false;
	});
</script>

<svelte:head>
	<title>Flower Management — Flora Fusion Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-semibold text-charcoal-900">Flower Management</h1>
<p class="mt-1 text-sm text-charcoal-700">Edit details and upload photography for each of the 30 flowers.</p>

{#if loading}
	<div class="mt-8">
		<LoadingSpinner fullScreen label="Loading flowers" />
	</div>
{:else}
	<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each flowers as flower (flower.id)}
			<a href={`/admin/flowers/${flower.id}`} class="overflow-hidden rounded-2xl border border-charcoal-100 bg-white hover:shadow-md">
				<div class="aspect-square bg-cream-100">
					{#await resolveStorageUrl(flower.mainImage) then url}
						<img src={url} alt={flower.commonName} class="h-full w-full object-cover" />
					{/await}
				</div>
				<div class="p-3">
					<p class="text-sm font-semibold text-charcoal-900">{flower.commonName}</p>
					<p class="text-xs text-charcoal-700">{flower.category}</p>
				</div>
			</a>
		{/each}
	</div>
{/if}
