<script lang="ts">
	import { onMount } from 'svelte';
	import { listAllSubmissions, updateSubmissionStatus } from '$lib/repositories/submission.repository';
	import { createNotification } from '$lib/repositories/notification.repository';
	import type { FlowerSubmission } from '$lib/types/flower';
	import { toastStore } from '$lib/stores/toast.store';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let submissions = $state<FlowerSubmission[]>([]);
	let loading = $state(true);
	let updatingId = $state('');
	let statusFilter = $state<FlowerSubmission['status'] | 'All'>('All');

	const statuses: (FlowerSubmission['status'] | 'All')[] = [
		'All',
		'Submitted',
		'Under Review',
		'Accepted',
		'In Production',
		'Completed',
		'Rejected'
	];

	const statusColor: Record<string, string> = {
		Submitted: 'bg-cream-500/40 text-charcoal-900',
		'Under Review': 'bg-bloom-100 text-bloom-700',
		Accepted: 'bg-sage-100 text-sage-700',
		'In Production': 'bg-bloom-100 text-bloom-700',
		Completed: 'bg-sage-200 text-sage-800',
		Rejected: 'bg-red-100 text-red-700'
	};

	onMount(async () => {
		submissions = await listAllSubmissions();
		loading = false;
	});

	const filtered = $derived(statusFilter === 'All' ? submissions : submissions.filter((s) => s.status === statusFilter));

	async function handleStatusChange(submission: FlowerSubmission, status: FlowerSubmission['status']) {
		updatingId = submission.id;
		try {
			await updateSubmissionStatus(submission.id, status);
			await createNotification(
				submission.uid,
				'Submission Update',
				`Your flower submission is now "${status}"`,
				`${submission.flowerType} for your ${submission.occasion.toLowerCase()} has been updated.`,
				`/dashboard/submissions/${submission.id}`
			);
			submissions = submissions.map((s) => (s.id === submission.id ? { ...s, status } : s));
			toastStore.success('Submission updated and customer notified.');
		} catch {
			toastStore.error('Could not update submission.');
		} finally {
			updatingId = '';
		}
	}
</script>

<svelte:head>
	<title>Manufacturing — Flora Fusion Admin</title>
</svelte:head>

<h1 class="font-display text-2xl font-semibold text-charcoal-900">Manufacturing & Submissions</h1>
<p class="mt-1 text-sm text-charcoal-700">Review customer flower submissions and track manufacturing status.</p>

<div class="mt-4 flex flex-wrap gap-2">
	{#each statuses as status}
		<button
			type="button"
			onclick={() => (statusFilter = status)}
			class={`badge border ${statusFilter === status ? 'border-bloom-600 bg-bloom-600 text-white' : 'border-charcoal-100 text-charcoal-700'}`}
		>
			{status}
		</button>
	{/each}
</div>

{#if loading}
	<div class="mt-8">
		<LoadingSpinner fullScreen label="Loading submissions" />
	</div>
{:else if filtered.length === 0}
	<div class="mt-8">
		<EmptyState icon="🌿" title="No submissions found" description="No submissions match this filter." />
	</div>
{:else}
	<div class="mt-6 space-y-4">
		{#each filtered as submission (submission.id)}
			<div class="rounded-2xl border border-charcoal-100 bg-white p-5">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<p class="font-semibold text-charcoal-900">{submission.flowerType}</p>
						<p class="text-sm text-charcoal-700">
							{submission.occasion} · {submission.flowerWeightGrams}g · Submitted
							{new Date(submission.createdAt).toLocaleDateString()}
						</p>
						{#if submission.weightEngineResult}
							<p class="mt-1 text-xs text-charcoal-700">
								Feasible: {submission.weightEngineResult.productionFeasible ? 'Yes' : 'No'} · Est. Cost: ₹{submission.weightEngineResult.estimatedCost}
							</p>
						{/if}
					</div>
					<span class={`badge ${statusColor[submission.status]}`}>{submission.status}</span>
				</div>

				{#if submission.photos.length > 0}
					<div class="mt-3 flex gap-2">
						{#each submission.photos.slice(0, 5) as photo}
							<img src={photo} alt="Submitted flower" class="h-16 w-16 rounded-lg object-cover" />
						{/each}
					</div>
				{/if}

				<div class="mt-4 flex items-center gap-2">
					<label for={`status-${submission.id}`} class="text-xs font-medium text-charcoal-700">Update status:</label>
					<select
						id={`status-${submission.id}`}
						value={submission.status}
						disabled={updatingId === submission.id}
						onchange={(e) => handleStatusChange(submission, (e.target as HTMLSelectElement).value as FlowerSubmission['status'])}
						class="rounded-lg border border-charcoal-100 px-2 py-1 text-sm"
					>
						{#each statuses.filter((s) => s !== 'All') as status}
							<option value={status}>{status}</option>
						{/each}
					</select>
				</div>
			</div>
		{/each}
	</div>
{/if}
