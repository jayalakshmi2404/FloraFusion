<script lang="ts">
	import '../app.css';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth.store';
	import { initAnalytics, trackPageView } from '$lib/services/analytics.service';
	import { getPerformanceInstance } from '$lib/firebase';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	let { children } = $props();

	onMount(() => {
		authStore.init();
		initAnalytics();
		getPerformanceInstance();
	});

	onDestroy(() => {
		authStore.destroy();
	});

	$effect(() => {
		trackPageView($page.url.pathname, document.title);
	});
</script>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>

<ToastContainer />
