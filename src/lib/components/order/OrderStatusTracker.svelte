<script lang="ts">
	import type { OrderStatus } from '$lib/types/product';

	interface Props {
		status: OrderStatus;
	}

	let { status }: Props = $props();

	const steps: OrderStatus[] = ['Confirmed', 'In Production', 'Quality Check', 'Shipped', 'Delivered'];

	const currentIndex = $derived(steps.indexOf(status));
	const isCancelled = $derived(status === 'Cancelled');
</script>

{#if isCancelled}
	<div class="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">This order has been cancelled.</div>
{:else}
	<div class="flex items-center">
		{#each steps as step, i}
			<div class="flex flex-1 flex-col items-center">
				<div class="flex w-full items-center">
					<div class={`h-0.5 flex-1 ${i === 0 ? 'bg-transparent' : i <= currentIndex ? 'bg-bloom-600' : 'bg-charcoal-100'}`}></div>
					<div
						class={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
							i <= currentIndex ? 'bg-bloom-600 text-white' : 'bg-charcoal-100 text-charcoal-700'
						}`}
					>
						{i + 1}
					</div>
					<div class={`h-0.5 flex-1 ${i === steps.length - 1 ? 'bg-transparent' : i < currentIndex ? 'bg-bloom-600' : 'bg-charcoal-100'}`}></div>
				</div>
				<span class="mt-2 text-center text-[11px] font-medium text-charcoal-700">{step}</span>
			</div>
		{/each}
	</div>
{/if}
