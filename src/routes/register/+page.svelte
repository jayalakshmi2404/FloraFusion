<script lang="ts">
	import { goto } from '$app/navigation';
	import AuthCard from '$lib/components/auth/AuthCard.svelte';
	import PasswordInput from '$lib/components/auth/PasswordInput.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { registerSchema } from '$lib/schemas/validation';
	import { registerUser, AuthServiceError, syncSessionCookie } from '$lib/services/auth.service';
	import { authStore } from '$lib/stores/auth.store';
	import { trackSignUp } from '$lib/services/analytics.service';

	let fullName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let agreedToTerms = $state(false);
	let errors = $state<Record<string, string>>({});
	let formError = $state('');
	let submitting = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errors = {};
		formError = '';

		if (!agreedToTerms) {
			formError = 'Please agree to the Terms of Service to continue.';
			return;
		}

		const result = registerSchema.safeParse({ fullName, email, password, confirmPassword });
		if (!result.success) {
			for (const issue of result.error.issues) {
				errors[issue.path[0] as string] = issue.message;
			}
			return;
		}

		submitting = true;
		try {
			const user = await registerUser(result.data);
			await syncSessionCookie(user);
			trackSignUp('email');
			authStore.reset();
			await new Promise((r) => setTimeout(r, 50));
			authStore.init();
			await goto('/dashboard');
		} catch (err) {
			formError = err instanceof AuthServiceError ? err.message : 'Something went wrong. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Create Account — Flora Fusion</title>
	<meta name="description" content="Create your Flora Fusion account to submit flowers, shop keepsakes, and track orders." />
</svelte:head>

<AuthCard title="Create Your Account" subtitle="Join Flora Fusion to preserve your memories">
	<form onsubmit={handleSubmit} class="space-y-5" novalidate>
		{#if formError}
			<div class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</div>
		{/if}

		<div>
			<label for="fullName" class="label-text">Full Name</label>
			<input
				id="fullName"
				type="text"
				bind:value={fullName}
				autocomplete="name"
				required
				aria-invalid={!!errors.fullName}
				class={`input-field ${errors.fullName ? 'input-error' : ''}`}
				placeholder="Ananya Rao"
			/>
			{#if errors.fullName}<p class="mt-1.5 text-xs text-red-600">{errors.fullName}</p>{/if}
		</div>

		<div>
			<label for="email" class="label-text">Email Address</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				autocomplete="email"
				required
				aria-invalid={!!errors.email}
				class={`input-field ${errors.email ? 'input-error' : ''}`}
				placeholder="you@example.com"
			/>
			{#if errors.email}<p class="mt-1.5 text-xs text-red-600">{errors.email}</p>{/if}
		</div>

		<PasswordInput
			id="password"
			label="Password"
			bind:value={password}
			error={errors.password}
			showStrength
			autocomplete="new-password"
		/>

		<PasswordInput
			id="confirmPassword"
			label="Confirm Password"
			bind:value={confirmPassword}
			error={errors.confirmPassword}
			autocomplete="new-password"
		/>

		<label class="flex items-start gap-2 text-sm text-charcoal-700">
			<input type="checkbox" bind:checked={agreedToTerms} class="mt-0.5 h-4 w-4 rounded border-charcoal-100 text-bloom-600" />
			<span>I agree to the Terms of Service and Privacy Policy.</span>
		</label>

		<Button type="submit" variant="primary" fullWidth loading={submitting}>
			Create Account
		</Button>
	</form>
	{#snippet footer()}
		Already have an account?
		<a href="/login" class="font-semibold text-bloom-600 hover:underline">Sign in</a>
	{/snippet}
</AuthCard>
