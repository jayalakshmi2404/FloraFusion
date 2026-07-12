<script lang="ts">
	import { page } from '$app/stores';
	import { authStore, isAdmin } from '$lib/stores/auth.store';
	import { cartCount } from '$lib/stores/cart.store';
	import { unreadNotificationsStore } from '$lib/stores/notifications.store';
	import { logoutUser } from '$lib/services/auth.service';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let mobileOpen = $state(false);
	let userMenuOpen = $state(false);

	onMount(() => {
		const unsubscribe = authStore.subscribe(($auth) => {
			unreadNotificationsStore.refresh($auth.user?.uid ?? null);
		});
		return unsubscribe;
	});

	const navLinks = [
		{ href: '/flowers', label: 'Flowers' },
		{ href: '/products', label: 'Keepsakes' },
		{ href: '/submit-flower', label: 'Submit Flowers' },
		{ href: '/about', label: 'About' }
	];

	async function handleLogout() {
		await logoutUser();
		authStore.reset();
		userMenuOpen = false;
		await goto('/');
	}
</script>

<header class="sticky top-0 z-50 border-b border-bloom-100 bg-cream-50/90 backdrop-blur-md">
	<nav class="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
		<a href="/" class="flex items-center gap-2 font-display text-2xl font-semibold text-bloom-700">
			<img src="/images/logo.png" alt="Flora Fusion" class="h-8 w-8 rounded-full object-cover" />
			Flora Fusion
		</a>

		<div class="hidden items-center gap-8 md:flex">
			{#each navLinks as link}
				<a
					href={link.href}
					class="text-sm font-medium text-charcoal-700 transition-colors hover:text-bloom-600 {$page.url.pathname.startsWith(
						link.href
					)
						? 'text-bloom-600'
						: ''}"
				>
					{link.label}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-3">
			{#if $authStore.user}
				<a
					href="/dashboard/notifications"
					class="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal-700 transition-colors hover:bg-bloom-50 hover:text-bloom-600"
					aria-label="Notifications"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
						<path d="M13.73 21a2 2 0 0 1-3.46 0" />
					</svg>
					{#if $unreadNotificationsStore > 0}
						<span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-bloom-600 text-[10px] font-bold text-white">
							{$unreadNotificationsStore}
						</span>
					{/if}
				</a>
			{/if}

			<a
				href="/cart"
				class="relative flex h-10 w-10 items-center justify-center rounded-full text-charcoal-700 transition-colors hover:bg-bloom-50 hover:text-bloom-600"
				aria-label="Shopping cart"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
					<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
				</svg>
				{#if $cartCount > 0}
					<span class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-bloom-600 text-[10px] font-bold text-white">
						{$cartCount}
					</span>
				{/if}
			</a>

			{#if $authStore.user}
				<div class="relative">
					<button
						onclick={() => (userMenuOpen = !userMenuOpen)}
						class="flex h-10 w-10 items-center justify-center rounded-full bg-bloom-100 font-semibold text-bloom-700"
					>
						{$authStore.profile?.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
					</button>
					{#if userMenuOpen}
						<div class="absolute right-0 mt-2 w-48 rounded-xl border border-charcoal-100 bg-white py-2 shadow-lg">
							<a href={$isAdmin ? '/admin' : '/dashboard'} class="block px-4 py-2 text-sm hover:bg-bloom-50" onclick={() => (userMenuOpen = false)}>
								Dashboard
							</a>
							<a href="/profile" class="block px-4 py-2 text-sm hover:bg-bloom-50" onclick={() => (userMenuOpen = false)}>Profile</a>
							<a href="/orders" class="block px-4 py-2 text-sm hover:bg-bloom-50" onclick={() => (userMenuOpen = false)}>Orders</a>
							<button onclick={handleLogout} class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
								Sign Out
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/login" class="btn-secondary hidden sm:inline-flex">Sign In</a>
				<a href="/register" class="btn-primary hidden sm:inline-flex">Get Started</a>
			{/if}

			<button
				class="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
				onclick={() => (mobileOpen = !mobileOpen)}
				aria-label="Toggle menu"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
				</svg>
			</button>
		</div>
	</nav>

	{#if mobileOpen}
		<div class="border-t border-bloom-100 bg-cream-50 px-4 py-4 md:hidden">
			<div class="flex flex-col gap-3">
				{#each navLinks as link}
					<a href={link.href} class="py-1 text-sm font-medium text-charcoal-700" onclick={() => (mobileOpen = false)}>
						{link.label}
					</a>
				{/each}
				{#if !$authStore.user}
					<div class="mt-2 flex gap-3">
						<a href="/login" class="btn-secondary flex-1">Sign In</a>
						<a href="/register" class="btn-primary flex-1">Get Started</a>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</header>