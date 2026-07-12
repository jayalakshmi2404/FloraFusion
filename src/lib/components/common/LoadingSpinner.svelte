<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		label?: string;
		fullScreen?: boolean;
	}

	let { size = 'md', label = 'Loading', fullScreen = false }: Props = $props();

	const sizeClasses: Record<string, string> = {
		sm: 'h-4 w-4 border-2',
		md: 'h-8 w-8 border-[3px]',
		lg: 'h-14 w-14 border-4'
	};
</script>

{#if fullScreen}
	<div class="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3" role="status" aria-live="polite">
		<span class={`animate-spin rounded-full border-bloom-200 border-t-bloom-600 ${sizeClasses[size]}`}></span>
		<p class="text-sm font-medium text-charcoal-700">{label}</p>
	</div>
{:else}
	<span class="inline-flex items-center gap-2" role="status" aria-live="polite">
		<span class={`animate-spin rounded-full border-bloom-200 border-t-bloom-600 ${sizeClasses[size]}`}></span>
		<span class="sr-only">{label}</span>
	</span>
{/if}
