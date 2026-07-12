<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import AuthCard from '$lib/components/auth/AuthCard.svelte';
	import PasswordInput from '$lib/components/auth/PasswordInput.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { resetPasswordSchema } from '$lib/schemas/validation';
	import { resetPassword, AuthServiceError } from '$lib/services/auth.service';

	const oobCode = $page.url.searchParams.get('oobCode') ?? '';

	let newPassword = $state('');
	let confirmPassword = $state('');
	let errors = $state<Record<string, string>>({});
	let formError = $state('');
	let submitting = $state(false);
	let success = $state(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errors = {};
		formError = '';

		if (!oobCode) {
			formError = 'This reset link is invalid or has expired. Please request a new one.';
			return;
		}

		const result = resetPasswordSchema.safeParse({ oobCode, newPassword, confirmPassword });
		if (!result.success) {
			for (const issue of result.error.issues) {
				errors[issue.path[0] as string] = issue.message;
			}
			return;
		}

		submitting = true;
		try {
			await resetPassword(result.data);
			success = true;
			setTimeout(() => goto('/login'), 2500);
		} catch (err) {
			formError = err instanceof AuthServiceError ? err.message : 'Something went wrong. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Password — Flora Fusion</title>
</svelte:head>

<AuthCard title="Reset Your Password" subtitle="Choose a new, secure password">
	{#if !oobCode}
		<div class="rounded-xl bg-red-50 px-4 py-4 text-sm text-red-700" role="alert">
			This reset link is invalid or has expired.
			<a href="/forgot-password" class="font-semibold underline">Request a new one</a>.
		</div>
	{:else if success}
		<div class="rounded-xl bg-sage-50 px-4 py-4 text-sm text-sage-700" role="status">
			Your password has been reset successfully. Redirecting you to sign in…
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="space-y-5" novalidate>
			{#if formError}
				<div class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</div>
			{/if}

			<PasswordInput
				id="newPassword"
				label="New Password"
				bind:value={newPassword}
				error={errors.newPassword}
				showStrength
			/>
			<PasswordInput
				id="confirmPassword"
				label="Confirm New Password"
				bind:value={confirmPassword}
				error={errors.confirmPassword}
			/>

			<Button type="submit" variant="primary" fullWidth loading={submitting}>
				Reset Password
			</Button>
		</form>
	{/if}
</AuthCard>
