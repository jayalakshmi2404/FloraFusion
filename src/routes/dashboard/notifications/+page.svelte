<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.store';
	import { listUserNotifications, markAsRead, markAllAsRead } from '$lib/repositories/notification.repository';
	import type { AppNotification } from '$lib/types/notification';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import EmptyState from '$lib/components/common/EmptyState.svelte';

	let notifications = $state<AppNotification[]>([]);
	let loading = $state(true);

	const typeIcon: Record<string, string> = {
		'Order Update': '📦',
		'Submission Update': '🌿',
		Promotion: '🎁',
		System: 'ℹ️',
		'Review Request': '⭐'
	};

	async function load() {
		const uid = $authStore.user?.uid;
		if (uid) notifications = await listUserNotifications(uid);
		loading = false;
	}

	onMount(load);

	async function handleMarkRead(notification: AppNotification) {
		if (notification.read) return;
		await markAsRead(notification.id);
		notifications = notifications.map((n) => (n.id === notification.id ? { ...n, read: true } : n));
	}

	async function handleMarkAllRead() {
		const uid = $authStore.user?.uid;
		if (!uid) return;
		await markAllAsRead(uid);
		notifications = notifications.map((n) => ({ ...n, read: true }));
	}
</script>

<svelte:head>
	<title>Notifications — Flora Fusion</title>
</svelte:head>

<div class="flex items-center justify-between">
	<h1 class="font-display text-2xl font-semibold text-charcoal-900">Notifications</h1>
	{#if notifications.some((n) => !n.read)}
		<button type="button" onclick={handleMarkAllRead} class="text-sm font-medium text-bloom-600 hover:underline">
			Mark all as read
		</button>
	{/if}
</div>

{#if loading}
	<div class="mt-8">
		<LoadingSpinner fullScreen label="Loading notifications" />
	</div>
{:else if notifications.length === 0}
	<div class="mt-8">
		<EmptyState icon="🔔" title="No notifications yet" description="We'll let you know about order and submission updates here." />
	</div>
{:else}
	<div class="mt-6 space-y-2">
		{#each notifications as notification (notification.id)}
			<button
				type="button"
				onclick={() => handleMarkRead(notification)}
				class={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
					notification.read ? 'border-charcoal-100 bg-white' : 'border-bloom-200 bg-bloom-50'
				}`}
			>
				<span class="text-xl" aria-hidden="true">{typeIcon[notification.type]}</span>
				<div class="flex-1">
					<p class="text-sm font-semibold text-charcoal-900">{notification.title}</p>
					<p class="mt-0.5 text-sm text-charcoal-700">{notification.message}</p>
					<p class="mt-1 text-xs text-charcoal-100">
						{new Date(notification.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
					</p>
				</div>
				{#if !notification.read}
					<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-bloom-600" aria-label="Unread"></span>
				{/if}
			</button>
		{/each}
	</div>
{/if}
