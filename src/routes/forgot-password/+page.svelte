<script lang="ts">
	import AuthCard from '$lib/components/auth/AuthCard.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { forgotPasswordSchema } from '$lib/schemas/validation';
	import { requestPasswordReset, AuthServiceError } from '$lib/services/auth.service';

	let email = $state('');
	let error = $state('');
	let submitting = $state(false);
	let submitted = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		error = '';

		const result = forgotPasswordSchema.safeParse({ email });
		if (!result.success) {
			error = result.error.issues[0]?.message ?? 'Please enter a valid email.';
			return;
		}

		submitting = true;
		try {
			await requestPasswordReset(result.data.email);
			submitted = true;
		} catch (err) {
			// Avoid confirming whether an account exists; show a generic success-like message
			// unless it's a rate limit or invalid-email error.
			if (err instanceof AuthServiceError && err.code === 'auth/invalid-email') {
				error = err.message;
			} else if (err instanceof AuthServiceError && err.code === 'auth/too-many-requests') {
				error = err.message;
			} else {
				submitted = true;
			}
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Forgot Password — Flora Fusion</title>
	<meta name="description" content="Reset your Flora Fusion account password." />
</svelte:head>

<AuthCard title="Forgot Password?" subtitle="We'll email you a link to reset it">
	{#if submitted}
		<div class="rounded-xl bg-sage-50 px-4 py-4 text-sm text-sage-700" role="status">
			If an account exists for <strong>{email}</strong>, a password reset link has been sent. Please
			check your inbox and spam folder.
		</div>
		<div class="mt-6 text-center">
			<a href="/login" class="text-sm font-semibold text-bloom-600 hover:underline">Back to Sign In</a>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="space-y-5" novalidate>
			{#if error}
				<div class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>
			{/if}
			<div>
				<label for="email" class="label-text">Email Address</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					autocomplete="email"
					required
					aria-invalid={!!error}
					class={`input-field ${error ? 'input-error' : ''}`}
					placeholder="you@example.com"
				/>
			</div>
			<Button type="submit" variant="primary" fullWidth loading={submitting}>
				Send Reset Link
			</Button>
		</form>
	{/if}
	{#snippet footer()}
		Remembered your password?
		<a href="/login" class="font-semibold text-bloom-600 hover:underline">Sign in</a>
	{/snippet}
</AuthCard>
