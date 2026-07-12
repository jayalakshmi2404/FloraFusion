<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/common/Button.svelte';

	const status = $derived($page.status);
	const message = $derived($page.error?.message ?? 'Something went wrong.');

	const heading = $derived(
		status === 404 ? 'Page Not Found' : status === 403 ? 'Access Denied' : status === 401 ? 'Please Sign In' : 'Something Went Wrong'
	);

	const emoji = $derived(status === 404 ? '🥀' : status === 403 ? '🔒' : '🌸');
</script>

<svelte:head>
	<title>{heading} — Flora Fusion</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-center bg-gradient-to-b from-bloom-50 to-cream-50 px-4 py-16 text-center">
	<span class="text-6xl" aria-hidden="true">{emoji}</span>
	<p class="mt-4 font-display text-lg font-medium text-bloom-600">Error {status}</p>
	<h1 class="mt-2 font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">{heading}</h1>
	<p class="mt-3 max-w-md text-charcoal-700">{message}</p>

	<div class="mt-8 flex flex-col gap-3 sm:flex-row">
		<Button href="/" variant="primary">Back to Home</Button>
		<Button href="/flowers" variant="secondary">Browse Flowers</Button>
	</div>

	<p class="mt-8 text-sm text-charcoal-700">
		Need help? Contact <a href="mailto:florafusion111@gmail.com" class="text-bloom-600 hover:underline">florafusion111@gmail.com</a>
	</p>
</div>