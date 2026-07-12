<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import AuthCard from '$lib/components/auth/AuthCard.svelte';
	import RoleToggle from '$lib/components/auth/RoleToggle.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { loginSchema } from '$lib/schemas/validation';
	import { loginUser, AuthServiceError } from '$lib/services/auth.service';
	import { authStore } from '$lib/stores/auth.store';
	import { fetchUserProfile } from '$lib/services/auth.service';
	import { syncSessionCookie } from '$lib/services/auth.service';
	import type { UserRole } from '$lib/types/user';
	import { trackLogin } from '$lib/services/analytics.service';

	let email = $state('');
	let password = $state('');
	let role = $state<UserRole>(
		($page.url.searchParams.get('as') as UserRole) === 'admin' ? 'admin' : 'user'
	);
	let errors = $state<Record<string, string>>({});
	let submitting = $state(false);
	let formError = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errors = {};
		formError = '';

		const result = loginSchema.safeParse({ email, password, role });
		if (!result.success) {
			for (const issue of result.error.issues) {
				errors[issue.path[0] as string] = issue.message;
			}
			return;
		}

		submitting = true;
		try {
			const user = await loginUser(result.data);
			await syncSessionCookie(user);
			const profile = await fetchUserProfile(user.uid);
			trackLogin('email', role);
			authStore.reset();
			await new Promise((r) => setTimeout(r, 50));
			authStore.init();
			const redirectTo = $page.url.searchParams.get('redirectTo');
			await goto(redirectTo || (profile?.role === 'admin' ? '/admin' : '/dashboard'));
		} catch (err) {
			if (err instanceof AuthServiceError) {
				formError = err.message;
			} else {
				formError = 'Something went wrong. Please try again.';
			}
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In — Flora Fusion</title>
	<meta name="description" content="Sign in to your Flora Fusion account to track orders, manage your keepsakes, and more." />
</svelte:head>

<AuthCard title="Welcome Back" subtitle="Sign in to continue to Flora Fusion">
	<form onsubmit={handleSubmit} class="space-y-5" novalidate>
		<RoleToggle value={role} onChange={(r) => (role = r)} />

		{#if formError}
			<div class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</div>
		{/if}

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

		<div>
			<label for="password" class="label-text">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				autocomplete="current-password"
				required
				aria-invalid={!!errors.password}
				class={`input-field ${errors.password ? 'input-error' : ''}`}
				placeholder="••••••••"
			/>
			{#if errors.password}<p class="mt-1.5 text-xs text-red-600">{errors.password}</p>{/if}
		</div>

		<div class="flex justify-end">
			<a href="/forgot-password" class="text-sm font-medium text-bloom-600 hover:underline">Forgot password?</a>
		</div>

		<Button type="submit" variant="primary" fullWidth loading={submitting}>
			Sign In
		</Button>
	</form>
	{#snippet footer()}
		Don't have an account?
		<a href="/register" class="font-semibold text-bloom-600 hover:underline">Create one</a>
	{/snippet}
</AuthCard>
