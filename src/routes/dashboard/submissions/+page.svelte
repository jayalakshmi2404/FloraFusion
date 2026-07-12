<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.store';
	import { listUserSubmissions } from '$lib/repositories/submission.repository';
	import type { FlowerSubmission } from '$lib/types/flower';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';
	import Button from '$lib/components/common/Button.svelte';

	let submissions = $state<FlowerSubmission[]>([]);
	let loading = $state(true);

	const statusColor: Record<string, string> = {
		Submitted: 'bg-cream-500/40 text-charcoal-900',
		'Under Review': 'bg-bloom-100 text-bloom-700',
		Accepted: 'bg-sage-100 text-sage-700',
		'In Production': 'bg-bloom-100 text-bloom-700',
		Completed: 'bg-sage-200 text-sage-800',
		Rejected: 'bg-red-100 text-red-700'
	};

	onMount(async () => {
		const uid = $authStore.user?.uid;
		if (uid) submissions = await listUserSubmissions(uid);
		loading = false;
	});
</script>

<svelte:head>
	<title>My Submissions — Flora Fusion</title>
</svelte:head>

<div class="flex items-center justify-between">
	<h1 class="font-display text-2xl font-semibold text-charcoal-900">My Flower Submissions</h1>
	<Button href="/submit-flower" variant="primary" size="sm">Submit New Flowers</Button>
</div>

{#if loading}
	<div class="mt-8">
		<LoadingSpinner fullScreen label="Loading your submissions" />
	</div>
{:else if submissions.length === 0}
	<div class="mt-8">
		<EmptyState icon="🌿" title="No submissions yet" description="Submit your event flowers to start the preservation process." actionLabel="Submit Flowers" actionHref="/submit-flower" />
	</div>
{:else}
	<div class="mt-6 space-y-4">
		{#each submissions as submission (submission.id)}
			<a
				href={`/dashboard/submissions/${submission.id}`}
				class="flex flex-col gap-3 rounded-2xl border border-charcoal-100 bg-white p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
			>
				<div>
					<p class="font-semibold text-charcoal-900">{submission.flowerType}</p>
					<p class="text-sm text-charcoal-700">
						{submission.occasion} · {submission.flowerWeightGrams}g · Submitted
						{new Date(submission.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
					</p>
				</div>
				<span class={`badge w-fit ${statusColor[submission.status]}`}>{submission.status}</span>
			</a>
		{/each}
	</div>
{/if}
