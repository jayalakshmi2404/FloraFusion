<script lang="ts">
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/auth.store';
	import { flowerSubmissionSchema } from '$lib/schemas/validation';
	import { createFlowerSubmission } from '$lib/repositories/submission.repository';
	import { toastStore } from '$lib/stores/toast.store';
	import { trackFlowerSubmission } from '$lib/services/analytics.service';
	import Button from '$lib/components/common/Button.svelte';
	import PhotoUploader from '$lib/components/submission/PhotoUploader.svelte';
	import WeightEnginePanel from '$lib/components/submission/WeightEnginePanel.svelte';

	const occasions = [
		'Wedding',
		'Birthday',
		'Anniversary',
		'Memorial',
		'Graduation',
		'Corporate Event',
		'Religious Event'
	] as const;

	let flowerType = $state('');
	let flowerWeightGrams = $state<number>(0);
	let occasion = $state<(typeof occasions)[number]>('Wedding');
	let description = $state('');
	let preferredDeliveryDate = $state('');
	let photos = $state<string[]>([]);

	let errors = $state<Record<string, string>>({});
	let formError = $state('');
	let submitting = $state(false);

	const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errors = {};
		formError = '';

		const result = flowerSubmissionSchema.safeParse({
			flowerType,
			flowerWeightGrams,
			occasion,
			description,
			preferredDeliveryDate,
			photos
		});

		if (!result.success) {
			for (const issue of result.error.issues) {
				errors[issue.path[0] as string] = issue.message;
			}
			return;
		}

		const uid = $authStore.user?.uid;
		if (!uid) {
			formError = 'Please sign in to submit your flowers.';
			return;
		}

		submitting = true;
		try {
			const id = await createFlowerSubmission(uid, result.data);
			trackFlowerSubmission(result.data.flowerWeightGrams, result.data.occasion);
			toastStore.success('Your flowers have been submitted for review!');
			await goto(`/dashboard/submissions/${id}`);
		} catch {
			formError = 'Something went wrong while submitting. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Submit Your Flowers — Flora Fusion</title>
	<meta name="description" content="Submit your event flowers for professional preservation into a lasting keepsake." />
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
	<h1 class="font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">Submit Your Flowers</h1>
	<p class="mt-2 text-charcoal-700">
		Tell us about your flowers and we'll calculate what keepsakes are possible and when they'll be ready.
	</p>

	<form onsubmit={handleSubmit} class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			{#if formError}
				<div class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</div>
			{/if}

			<div>
				<label for="flowerType" class="label-text">Flower Type</label>
				<input
					id="flowerType"
					type="text"
					bind:value={flowerType}
					placeholder="e.g. Wedding bouquet — roses and eucalyptus"
					class={`input-field ${errors.flowerType ? 'input-error' : ''}`}
				/>
				{#if errors.flowerType}<p class="mt-1.5 text-xs text-red-600">{errors.flowerType}</p>{/if}
			</div>

			<div>
				<label for="weight" class="label-text">Flower Weight (grams)</label>
				<input
					id="weight"
					type="number"
					min="1"
					max="50000"
					bind:value={flowerWeightGrams}
					class={`input-field ${errors.flowerWeightGrams ? 'input-error' : ''}`}
					placeholder="e.g. 120"
				/>
				<p class="mt-1 text-xs text-charcoal-700">Not sure? A standard bridal bouquet is roughly 150–250g.</p>
				{#if errors.flowerWeightGrams}<p class="mt-1.5 text-xs text-red-600">{errors.flowerWeightGrams}</p>{/if}
			</div>

			<div>
				<span class="label-text">Occasion</span>
				<div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
					{#each occasions as o}
						<button
							type="button"
							onclick={() => (occasion = o)}
							class={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
								occasion === o
									? 'border-bloom-600 bg-bloom-50 text-bloom-700'
									: 'border-charcoal-100 text-charcoal-700 hover:bg-cream-100'
							}`}
						>
							{o}
						</button>
					{/each}
				</div>
			</div>

			<div>
				<label for="description" class="label-text">Description</label>
				<textarea
					id="description"
					bind:value={description}
					rows="3"
					class="input-field"
					placeholder="Tell us anything special about these flowers…"
				></textarea>
			</div>

			<div>
				<label for="deliveryDate" class="label-text">Preferred Delivery Date</label>
				<input
					id="deliveryDate"
					type="date"
					min={minDate}
					bind:value={preferredDeliveryDate}
					class={`input-field ${errors.preferredDeliveryDate ? 'input-error' : ''}`}
				/>
				{#if errors.preferredDeliveryDate}<p class="mt-1.5 text-xs text-red-600">{errors.preferredDeliveryDate}</p>{/if}
			</div>

			<div>
				<span class="label-text">Photos of Your Flowers</span>
				<PhotoUploader bind:photos />
				{#if errors.photos}<p class="mt-1.5 text-xs text-red-600">{errors.photos}</p>{/if}
			</div>

			<Button type="submit" variant="primary" size="lg" loading={submitting}>
				Submit for Review
			</Button>
		</div>

		<div>
			<div class="sticky top-24">
				<WeightEnginePanel weightGrams={flowerWeightGrams} />
			</div>
		</div>
	</form>
</div>
