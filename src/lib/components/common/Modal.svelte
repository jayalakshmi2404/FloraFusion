<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';

	interface Props {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		onClose: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { open, title, size = 'md', onClose, children, footer }: Props = $props();

	let dialogEl: HTMLDivElement | undefined = $state();
	let previouslyFocused: HTMLElement | null = null;

	const sizeClasses: Record<string, string> = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
			return;
		}
		if (event.key === 'Tab' && dialogEl) {
			const focusable = dialogEl.querySelectorAll<HTMLElement>(
				'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
	}

	$effect(() => {
		if (open) {
			previouslyFocused = document.activeElement as HTMLElement;
			document.body.style.overflow = 'hidden';
			queueMicrotask(() => dialogEl?.focus());
		} else {
			document.body.style.overflow = '';
			previouslyFocused?.focus();
		}
	});

	onDestroy(() => {
		document.body.style.overflow = '';
	});
</script>

{#if open}
	<div
		class="fixed inset-0 z-[90] flex items-center justify-center p-4"
		role="presentation"
		transition:fade={{ duration: 150 }}
	>
		<button
			class="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm"
			aria-label="Close modal"
			onclick={onClose}
		></button>

		<div
			bind:this={dialogEl}
			role="dialog"
			aria-modal="true"
			aria-labelledby={title ? 'modal-title' : undefined}
			tabindex="-1"
			onkeydown={handleKeydown}
			transition:scale={{ duration: 200, start: 0.96 }}
			class={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ${sizeClasses[size]}`}
		>
			<div class="mb-4 flex items-center justify-between">
				{#if title}
					<h2 id="modal-title" class="font-display text-xl font-semibold text-charcoal-900">{title}</h2>
				{/if}
				<button
					onclick={onClose}
					aria-label="Close"
					class="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-charcoal-700 hover:bg-charcoal-100"
				>
					&times;
				</button>
			</div>

			{@render children()}

			{#if footer}
				<div class="mt-6 flex justify-end gap-3 border-t border-charcoal-100 pt-4">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
