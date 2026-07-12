<script lang="ts">
	import { calculateWeightEngine } from '$lib/services/weight-engine.service';
	import { getAllKeepsakeTypes } from '$lib/services/weight-engine.service';

	interface Props {
		weightGrams: number;
	}

	let { weightGrams }: Props = $props();

	const result = $derived(calculateWeightEngine(weightGrams || 0));
	const totalKeepsakeTypes = getAllKeepsakeTypes().length;
</script>

<div class="rounded-2xl border border-charcoal-100 bg-cream-50 p-5">
	<h3 class="font-display text-lg font-semibold text-charcoal-900">Flower Weight Engine</h3>

	{#if !weightGrams || weightGrams <= 0}
		<p class="mt-2 text-sm text-charcoal-700">Enter your flower weight to see production feasibility.</p>
	{:else if !result.productionFeasible}
		<div class="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
			We can't produce a keepsake with {weightGrams}g of flowers right now. Try between 1g and 5000g,
			matching one of our {totalKeepsakeTypes} keepsake types.
		</div>
	{:else}
		<dl class="mt-4 grid grid-cols-2 gap-4 text-sm">
			<div>
				<dt class="text-charcoal-700">Eligible Keepsakes</dt>
				<dd class="font-medium text-charcoal-900">{result.eligibleKeepsakes.length}</dd>
			</div>
			<div>
				<dt class="text-charcoal-700">Required Quantity</dt>
				<dd class="font-medium text-charcoal-900">{result.requiredFlowerQuantityGrams}g</dd>
			</div>
			<div>
				<dt class="text-charcoal-700">Estimated Waste</dt>
				<dd class="font-medium text-charcoal-900">{result.wastePercentage}%</dd>
			</div>
			<div>
				<dt class="text-charcoal-700">Manufacturing Time</dt>
				<dd class="font-medium text-charcoal-900">{result.estimatedManufacturingDays} days</dd>
			</div>
			<div>
				<dt class="text-charcoal-700">Est. Completion</dt>
				<dd class="font-medium text-charcoal-900">
					{new Date(result.estimatedCompletionDate).toLocaleDateString(undefined, {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
					})}
				</dd>
			</div>
			<div>
				<dt class="text-charcoal-700">Estimated Cost</dt>
				<dd class="font-semibold text-bloom-700">₹{result.estimatedCost}</dd>
			</div>
		</dl>

		<div class="mt-4">
			<p class="text-xs font-medium uppercase tracking-wide text-charcoal-700">You may be eligible for</p>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each result.eligibleKeepsakes as keepsake}
					<span class="badge bg-sage-100 text-sage-700">{keepsake}</span>
				{/each}
			</div>
		</div>
	{/if}
</div>
