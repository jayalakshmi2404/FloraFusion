<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.store';
	import { getUserReviews } from '$lib/repositories/flower.repository';
	import type { FlowerReview } from '$lib/types/flower';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let reviews = $state<(FlowerReview & { flowerId: string })[]>([]);
	let loading = $state(true);

	onMount(async () => {
		const uid = $authStore.user?.uid;
		if (uid) reviews = await getUserReviews(uid);
		loading = false;
	});
</script>

<svelte:head>
	<title>My Reviews — Flora Fusion</title>
</svelte:head>

<h1 class="font-display text-2xl font-semibold text-charcoal-900">My Reviews</h1>
<p class="mt-1 text-charcoal-700">Reviews you've left on preserved flowers.</p>

{#if loading}
	<div class="mt-8">
		<LoadingSpinner fullScreen label="Loading your reviews" />
	</div>
{:else if reviews.length === 0}
	<div class="mt-8">
		<EmptyState icon="⭐" title="You haven't written any reviews yet" description="Purchase and review flowers to help other customers." actionLabel="Browse Flowers" actionHref="/flowers" />
	</div>
{:else}
	<div class="mt-6 space-y-4">
		{#each reviews as review (review.id)}
			<a href={`/flowers/${review.flowerId}`} class="block rounded-2xl border border-charcoal-100 bg-white p-5 hover:shadow-md">
				<div class="flex items-center justify-between">
					<div class="flex text-cream-500 text-sm">
						{#each Array(5) as _, i}
							<span aria-hidden="true">{i < review.rating ? '★' : '☆'}</span>
						{/each}
					</div>
					<span class="text-xs text-charcoal-700">{new Date(review.createdAt).toLocaleDateString()}</span>
				</div>
				<p class="mt-2 text-sm text-charcoal-700">{review.comment}</p>
			</a>
		{/each}
	</div>
{/if}
