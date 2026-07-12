<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		children: Snippet;
		footer?: Snippet;
	}

	let { title, subtitle, children, footer }: Props = $props();
</script>

<div class="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center overflow-hidden bg-gradient-to-b from-bloom-50 to-cream-50 px-4 py-12">
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<div class="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-bloom-200/40 blur-3xl"></div>
		<div class="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sage-200/40 blur-3xl"></div>
	</div>

	<div class="relative w-full max-w-md">
		<div class="mb-6 text-center">
			<a href="/" class="inline-flex items-center gap-2 font-display text-2xl font-semibold text-bloom-700">
				<span aria-hidden="true">🌸</span> Flora Fusion
			</a>
		</div>

		<div class="card-glass p-8">
			<h1 class="font-display text-2xl font-semibold text-charcoal-900">{title}</h1>
			{#if subtitle}
				<p class="mt-1 text-sm text-charcoal-700">{subtitle}</p>
			{/if}

			<div class="mt-6">
				{@render children()}
			</div>
		</div>

		{#if footer}
			<div class="mt-6 text-center text-sm text-charcoal-700">
				{@render footer()}
			</div>
		{/if}
	</div>
</div>
