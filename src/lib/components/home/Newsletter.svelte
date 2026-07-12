<script lang="ts">
	import { emailSchema } from '$lib/schemas/validation';
	import { toastStore } from '$lib/stores/toast.store';

	let email = $state('');
	let submitting = $state(false);
	let error = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		error = '';

		const result = emailSchema.safeParse(email);
		if (!result.success) {
			error = result.error.issues[0]?.message ?? 'Please enter a valid email.';
			return;
		}

		submitting = true;
		try {
			const response = await fetch('/api/newsletter', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: result.data })
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({}));
				throw new Error(data.error ?? 'Something went wrong. Please try again.');
			}

			toastStore.success("You're subscribed! Watch your inbox for floral inspiration.");
			email = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Something went wrong.';
		} finally {
			submitting = false;
		}
	}
</script>

<section class="bg-bloom-700 py-16">
	<div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
		<h2 class="font-display text-3xl font-semibold text-white sm:text-4xl">Stay in Bloom</h2>
		<p class="mt-3 text-bloom-100">
			Get seasonal flower drops, preservation tips, and exclusive offers in your inbox.
		</p>
		<form onsubmit={handleSubmit} class="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row" novalidate>
			<label for="newsletter-email" class="sr-only">Email address</label>
			<input
				id="newsletter-email"
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				required
				aria-invalid={!!error}
				aria-describedby={error ? 'newsletter-error' : undefined}
				class="input-field flex-1 border-none"
			/>
			<button type="submit" disabled={submitting} class="btn-primary bg-cream-500 text-charcoal-900 hover:bg-cream-500/90 disabled:opacity-60">
				{submitting ? 'Subscribing…' : 'Subscribe'}
			</button>
		</form>
		{#if error}
			<p id="newsletter-error" class="mt-2 text-sm text-cream-200" role="alert">{error}</p>
		{/if}
	</div>
</section>
