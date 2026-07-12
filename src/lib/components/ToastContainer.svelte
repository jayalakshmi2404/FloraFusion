<script lang="ts">
	import { toastStore } from '$lib/stores/toast.store';
	import { fly, fade } from 'svelte/transition';

	const icons: Record<string, string> = {
		success: '✓',
		error: '✕',
		info: 'ℹ',
		warning: '⚠'
	};

	const colors: Record<string, string> = {
		success: 'bg-sage-600 text-white',
		error: 'bg-red-600 text-white',
		info: 'bg-charcoal-800 text-white',
		warning: 'bg-cream-500 text-charcoal-900'
	};
</script>

<div class="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col gap-3" aria-live="polite">
	{#each $toastStore as toast (toast.id)}
		<div
			role="alert"
			in:fly={{ y: 20, duration: 250 }}
			out:fade={{ duration: 150 }}
			class="pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 shadow-lg {colors[toast.type]}"
		>
			<span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
				{icons[toast.type]}
			</span>
			<p class="text-sm font-medium">{toast.message}</p>
			<button
				class="ml-auto shrink-0 text-lg leading-none opacity-70 hover:opacity-100"
				onclick={() => toastStore.dismiss(toast.id)}
				aria-label="Dismiss notification"
			>
				&times;
			</button>
		</div>
	{/each}
</div>
