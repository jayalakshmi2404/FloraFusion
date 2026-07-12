<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getFlowerById, getFlowerReviews, addFlowerReview } from '$lib/repositories/flower.repository';
	import type { Flower, FlowerReview } from '$lib/types/flower';
	import { cartStore } from '$lib/stores/cart.store';
	import { authStore } from '$lib/stores/auth.store';
	import { toastStore } from '$lib/stores/toast.store';
	import { reviewSchema } from '$lib/schemas/validation';
	import { resolveStorageUrl } from '$lib/utils/storage-url';
	import { trackViewItem, trackAddToCart } from '$lib/services/analytics.service';
	import ImageGallery from '$lib/components/flower/ImageGallery.svelte';
	import StarRatingInput from '$lib/components/flower/StarRatingInput.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let flower = $state<Flower | null>(null);
	let reviews = $state<FlowerReview[]>([]);
	let loading = $state(true);
	let quantity = $state(1);

	let reviewRating = $state(5);
	let reviewComment = $state('');
	let reviewError = $state('');
	let submittingReview = $state(false);

	onMount(async () => {
		const id = $page.params.id as string;
		const [flowerData, reviewData] = await Promise.all([getFlowerById(id), getFlowerReviews(id)]);
		flower = flowerData;
		reviews = reviewData;
		loading = false;

		if (flower) {
			trackViewItem({ id: flower.id, name: flower.commonName, category: flower.category, price: flower.price });
		}
	});

	function addToCart() {
		if (!flower) return;
		cartStore.addItem({
			productId: flower.id,
			productName: flower.commonName,
			image: flower.mainImage,
			price: flower.price,
			quantity
		});
		trackAddToCart({ id: flower.id, name: flower.commonName, price: flower.price, quantity });
		toastStore.success(`${flower.commonName} added to cart.`);
	}

	async function handleReviewSubmit(event: SubmitEvent) {
		event.preventDefault();
		reviewError = '';

		if (!$authStore.user) {
			reviewError = 'Please sign in to leave a review.';
			return;
		}

		const result = reviewSchema.safeParse({
			targetId: flower!.id,
			rating: reviewRating,
			comment: reviewComment
		});

		if (!result.success) {
			reviewError = result.error.issues[0]?.message ?? 'Please check your review.';
			return;
		}

		submittingReview = true;
		try {
			await addFlowerReview(flower!.id, {
				uid: $authStore.user.uid,
				userName: $authStore.profile?.fullName ?? 'Flora Fusion Customer',
				rating: result.data.rating,
				comment: result.data.comment
			});
			reviews = await getFlowerReviews(flower!.id);
			reviewComment = '';
			reviewRating = 5;
			toastStore.success('Thank you for your review!');
		} catch {
			reviewError = 'Could not submit your review. Please try again.';
		} finally {
			submittingReview = false;
		}
	}
</script>

<svelte:head>
	<title>{flower ? `${flower.commonName} — Flora Fusion` : 'Flower — Flora Fusion'}</title>
	{#if flower}
		<meta name="description" content={flower.description} />
	{/if}
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	{#if loading}
		<LoadingSpinner fullScreen label="Loading flower details" />
	{:else if !flower}
		<EmptyState icon="🥀" title="Flower not found" description="This flower may no longer be available." actionLabel="Browse Flowers" actionHref="/flowers" />
	{:else}
		<div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
			<div>
				<ImageGallery images={[flower.mainImage, ...flower.galleryImages]} altPrefix={flower.commonName} />
			</div>

			<div>
				<span class="badge bg-bloom-100 text-bloom-700">{flower.category}</span>
				<h1 class="mt-3 font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">{flower.commonName}</h1>
				<p class="italic text-charcoal-700">{flower.botanicalName}</p>

				<div class="mt-3 flex items-center gap-2">
					<div class="flex text-cream-500" aria-label={`Rated ${flower.rating} out of 5`}>
						{#each Array(5) as _, i}
							<span aria-hidden="true">{i < Math.round(flower.rating) ? '★' : '☆'}</span>
						{/each}
					</div>
					<span class="text-sm text-charcoal-700">({reviews.length} review{reviews.length === 1 ? '' : 's'})</span>
				</div>

				<p class="mt-5 font-display text-3xl font-semibold text-bloom-700">₹{flower.price}</p>

				<p class="mt-4 text-charcoal-700">{flower.description}</p>

				<dl class="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-charcoal-100 p-5 text-sm">
					<div>
						<dt class="text-charcoal-700">Preservation Method</dt>
						<dd class="font-medium text-charcoal-900">{flower.preservationMethod}</dd>
					</div>
					<div>
						<dt class="text-charcoal-700">Expected Life</dt>
						<dd class="font-medium text-charcoal-900">{flower.expectedPreservedLife}</dd>
					</div>
					<div>
						<dt class="text-charcoal-700">Season</dt>
						<dd class="font-medium text-charcoal-900">{flower.season}</dd>
					</div>
					<div>
						<dt class="text-charcoal-700">Origin</dt>
						<dd class="font-medium text-charcoal-900">{flower.country}</dd>
					</div>
					<div>
						<dt class="text-charcoal-700">Stock</dt>
						<dd class="font-medium text-charcoal-900">{flower.remainingStock} / {flower.availableStock}</dd>
					</div>
					<div>
						<dt class="text-charcoal-700">Supplier</dt>
						<dd class="font-medium text-charcoal-900">{flower.supplier}</dd>
					</div>
				</dl>

				<div class="mt-6 flex flex-wrap gap-2">
					{#each flower.tags as tag}
						<span class="badge bg-cream-100 text-charcoal-700">#{tag}</span>
					{/each}
				</div>

				<div class="mt-8 flex items-center gap-4">
					<div class="flex items-center rounded-full border border-charcoal-100">
						<button
							type="button"
							onclick={() => (quantity = Math.max(1, quantity - 1))}
							class="flex h-10 w-10 items-center justify-center text-lg"
							aria-label="Decrease quantity"
						>
							−
						</button>
						<span class="w-8 text-center text-sm font-medium">{quantity}</span>
						<button
							type="button"
							onclick={() => (quantity = Math.min(flower!.remainingStock, quantity + 1))}
							class="flex h-10 w-10 items-center justify-center text-lg"
							aria-label="Increase quantity"
						>
							+
						</button>
					</div>
					<Button variant="primary" size="lg" onclick={addToCart} disabled={flower.remainingStock <= 0}>
						{flower.remainingStock <= 0 ? 'Sold Out' : 'Add to Cart'}
					</Button>
				</div>
			</div>
		</div>

		<section class="mt-16 border-t border-charcoal-100 pt-10" aria-labelledby="reviews-heading">
			<h2 id="reviews-heading" class="font-display text-2xl font-semibold text-charcoal-900">Customer Reviews</h2>

			<form onsubmit={handleReviewSubmit} class="mt-6 max-w-xl rounded-2xl border border-charcoal-100 p-5">
				<p class="label-text">Your Rating</p>
				<StarRatingInput bind:value={reviewRating} onChange={(r) => (reviewRating = r)} />
				<label for="comment" class="label-text mt-4">Your Review</label>
				<textarea
					id="comment"
					bind:value={reviewComment}
					rows="3"
					class="input-field"
					placeholder="Share your experience with this flower…"
				></textarea>
				{#if reviewError}<p class="mt-1.5 text-xs text-red-600" role="alert">{reviewError}</p>{/if}
				<Button type="submit" variant="secondary" loading={submittingReview}>
					Submit Review
				</Button>
			</form>

			{#if reviews.length === 0}
				<p class="mt-8 text-sm text-charcoal-700">Be the first to review this flower.</p>
			{:else}
				<div class="mt-8 space-y-5">
					{#each reviews as review (review.id)}
						<div class="rounded-2xl border border-charcoal-100 p-5">
							<div class="flex items-center justify-between">
								<p class="font-semibold text-charcoal-900">{review.userName}</p>
								<div class="flex text-cream-500 text-sm">
									{#each Array(5) as _, i}
										<span aria-hidden="true">{i < review.rating ? '★' : '☆'}</span>
									{/each}
								</div>
							</div>
							<p class="mt-2 text-sm text-charcoal-700">{review.comment}</p>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</div>
