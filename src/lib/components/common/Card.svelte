<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'elevated' | 'glass' | 'outline' | 'flat';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		hoverable?: boolean;
		href?: string;
		classNames?: string;
		children: Snippet;
	}

	let {
		variant = 'elevated',
		padding = 'md',
		hoverable = false,
		href,
		classNames = '',
		children
	}: Props = $props();

	const variantClasses: Record<string, string> = {
		elevated: 'bg-white border border-charcoal-100 shadow-sm',
		glass: 'card-glass',
		outline: 'bg-transparent border border-charcoal-100',
		flat: 'bg-cream-100'
	};

	const paddingClasses: Record<string, string> = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};

	const classes = $derived(
		`rounded-2xl transition-all duration-200 ${variantClasses[variant]} ${paddingClasses[padding]} ${
			hoverable ? 'hover:-translate-y-1 hover:shadow-lg' : ''
		} ${classNames}`
	);
</script>

{#if href}
	<a {href} class={classes}>
		{@render children()}
	</a>
{:else}
	<div class={classes}>
		{@render children()}
	</div>
{/if}
