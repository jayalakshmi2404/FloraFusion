<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit' | 'reset';
		href?: string;
		disabled?: boolean;
		loading?: boolean;
		fullWidth?: boolean;
		ariaLabel?: string;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		href,
		disabled = false,
		loading = false,
		fullWidth = false,
		ariaLabel,
		onclick,
		children
	}: Props = $props();

	const variantClasses: Record<string, string> = {
		primary:
			'bg-bloom-600 text-white shadow-bloom hover:bg-bloom-700 hover:shadow-lg active:scale-95 disabled:bg-bloom-300',
		secondary:
			'border border-bloom-300 bg-white text-bloom-700 hover:bg-bloom-50 active:scale-95 disabled:border-charcoal-100 disabled:text-charcoal-100',
		ghost: 'text-charcoal-700 hover:bg-charcoal-100 active:scale-95 disabled:text-charcoal-100',
		danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95 disabled:bg-red-300'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-4 py-2 text-xs rounded-full gap-1.5',
		md: 'px-6 py-3 text-sm rounded-full gap-2',
		lg: 'px-8 py-4 text-base rounded-full gap-2.5'
	};

	const classes = $derived(
		`inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bloom-400 focus-visible:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''}`
	);
</script>

{#if href && !disabled}
	<a {href} class={classes} aria-label={ariaLabel} role="button">
		{#if loading}
			<span class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true"></span>
		{/if}
		{@render children()}
	</a>
{:else}
	<button {type} class={classes} disabled={disabled || loading} aria-label={ariaLabel} onclick={onclick}>
		{#if loading}
			<span class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true"></span>
		{/if}
		{@render children()}
	</button>
{/if}
