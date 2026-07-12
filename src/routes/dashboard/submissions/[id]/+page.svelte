<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getSubmissionById } from '$lib/repositories/submission.repository';
	import type { FlowerSubmission } from '$lib/types/flower';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let submission = $state<FlowerSubmission | null>(null);
	let loading = $state(true);

	const statusSteps: FlowerSubmission['status'][] = [
		'Submitted',
		'Under Review',
		'Accepted',
		'In Production',
		'Completed'
	];

	onMount(async () => {
		submission = await getSubmissionById($page.params.id as string);
		loading = false;
	});

	const currentStepIndex = $derived(submission ? statusSteps.indexOf(submission.status) : -1);
</script>

<svelte:head>
	<title>Submission Details — Flora Fusion</title>
</svelte:head>

{#if loading}
	<LoadingSpinner fullScreen label="Loading submission" />
{:else if !submission}
	<EmptyState icon="🌿" title="Submission not found" actionLabel="View My Submissions" actionHref="/dashboard/submissions" />
{:else}
	<h1 class="font-display text-2xl font-semibold text-charcoal-900">{submission.flowerType}</h1>
	<p class="mt-1 text-charcoal-700">{submission.occasion} · Submitted {new Date(submission.createdAt).toLocaleDateString()}</p>

	{#if submission.status === 'Rejected'}
		<div class="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
			This submission was not accepted for processing. Contact
			<a href="mailto:florafusion111@gmail.com" class="underline">florafusion111@gmail.com</a> for details.
		</div>
	{:else}
		<div class="mt-6 rounded-2xl border border-charcoal-100 bg-white p-6">
			<div class="flex items-center">
				{#each statusSteps as step, i}
					<div class="flex flex-1 flex-col items-center">
						<div class="flex w-full items-center">
							<div class={`h-0.5 flex-1 ${i === 0 ? 'bg-transparent' : i <= currentStepIndex ? 'bg-bloom-600' : 'bg-charcoal-100'}`}></div>
							<div class={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= currentStepIndex ? 'bg-bloom-600 text-white' : 'bg-charcoal-100 text-charcoal-700'}`}>
								{i + 1}
							</div>
							<div class={`h-0.5 flex-1 ${i === statusSteps.length - 1 ? 'bg-transparent' : i < currentStepIndex ? 'bg-bloom-600' : 'bg-charcoal-100'}`}></div>
						</div>
						<span class="mt-2 text-center text-[11px] font-medium text-charcoal-700">{step}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
		<div class="rounded-2xl border border-charcoal-100 bg-white p-6">
			<h2 class="font-display text-lg font-semibold text-charcoal-900">Submission Details</h2>
			<dl class="mt-4 space-y-3 text-sm">
				<div class="flex justify-between"><dt class="text-charcoal-700">Weight</dt><dd class="font-medium">{submission.flowerWeightGrams}g</dd></div>
				<div class="flex justify-between"><dt class="text-charcoal-700">Occasion</dt><dd class="font-medium">{submission.occasion}</dd></div>
				<div class="flex justify-between"><dt class="text-charcoal-700">Preferred Delivery</dt><dd class="font-medium">{new Date(submission.preferredDeliveryDate).toLocaleDateString()}</dd></div>
			</dl>
			{#if submission.description}
				<p class="mt-4 text-sm text-charcoal-700">{submission.description}</p>
			{/if}
			{#if submission.photos.length > 0}
				<div class="mt-4 grid grid-cols-4 gap-2">
					{#each submission.photos as photo, i}
						<img src={photo} alt={`Submission photo ${i + 1}`} class="aspect-square rounded-lg object-cover" />
					{/each}
				</div>
			{/if}
		</div>

		{#if submission.weightEngineResult}
			<div class="rounded-2xl border border-charcoal-100 bg-cream-50 p-6">
				<h2 class="font-display text-lg font-semibold text-charcoal-900">Weight Engine Result</h2>
				<dl class="mt-4 space-y-3 text-sm">
					<div class="flex justify-between"><dt class="text-charcoal-700">Required Quantity</dt><dd class="font-medium">{submission.weightEngineResult.requiredFlowerQuantityGrams}g</dd></div>
					<div class="flex justify-between"><dt class="text-charcoal-700">Waste</dt><dd class="font-medium">{submission.weightEngineResult.wastePercentage}%</dd></div>
					<div class="flex justify-between"><dt class="text-charcoal-700">Manufacturing Time</dt><dd class="font-medium">{submission.weightEngineResult.estimatedManufacturingDays} days</dd></div>
					<div class="flex justify-between"><dt class="text-charcoal-700">Estimated Cost</dt><dd class="font-semibold text-bloom-700">₹{submission.weightEngineResult.estimatedCost}</dd></div>
				</dl>
				<div class="mt-4">
					<p class="text-xs font-medium uppercase tracking-wide text-charcoal-700">Eligible Keepsakes</p>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each submission.weightEngineResult.eligibleKeepsakes as keepsake}
							<span class="badge bg-sage-100 text-sage-700">{keepsake}</span>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}