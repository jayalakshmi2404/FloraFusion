<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/common/Button.svelte';

	interface Props {
		icon?: string;
		title: string;
		description?: string;
		actionLabel?: string;
		actionHref?: string;
		onAction?: () => void;
		children?: Snippet;
	}

	let { icon = '🌸', title, description, actionLabel, actionHref, onAction, children }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal-100 bg-white px-6 py-16 text-center">
	<span class="mb-4 text-5xl" aria-hidden="true">{icon}</span>
	<h3 class="font-display text-xl font-semibold text-charcoal-900">{title}</h3>
	{#if description}
		<p class="mt-2 max-w-sm text-sm text-charcoal-700">{description}</p>
	{/if}
	{#if children}
		<div class="mt-4">
			{@render children()}
		</div>
	{/if}
	{#if actionLabel && (actionHref || onAction)}
		<div class="mt-6">
			<Button href={actionHref} onclick={onAction} variant="primary">
				{actionLabel}
			</Button>
		</div>
	{/if}
</div>
