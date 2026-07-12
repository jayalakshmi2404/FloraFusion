<script lang="ts">
	import type { CartItem } from '$lib/types/product';
	import { cartStore } from '$lib/stores/cart.store';
	import { resolveStorageUrl } from '$lib/utils/storage-url';

	interface Props {
		item: CartItem;
	}

	let { item }: Props = $props();
</script>

<div class="flex items-center gap-4 border-b border-charcoal-100 py-5 last:border-none">
	<div class="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
		{#await resolveStorageUrl(item.image) then url}
			<img src={url} alt={item.productName} class="h-full w-full object-cover" />
		{/await}
	</div>

	<div class="flex-1">
		<p class="font-display font-semibold text-charcoal-900">{item.productName}</p>
		{#if item.customization?.notes}
			<p class="mt-0.5 text-xs text-charcoal-700">Note: {item.customization.notes}</p>
		{/if}
		<p class="mt-1 font-medium text-bloom-700">₹{item.price}</p>
	</div>

	<div class="flex items-center rounded-full border border-charcoal-100">
		<button
			type="button"
			onclick={() => cartStore.updateQuantity(item.id, item.quantity - 1)}
			class="flex h-8 w-8 items-center justify-center text-base"
			aria-label={`Decrease quantity of ${item.productName}`}
		>
			−
		</button>
		<span class="w-6 text-center text-sm font-medium">{item.quantity}</span>
		<button
			type="button"
			onclick={() => cartStore.updateQuantity(item.id, item.quantity + 1)}
			class="flex h-8 w-8 items-center justify-center text-base"
			aria-label={`Increase quantity of ${item.productName}`}
		>
			+
		</button>
	</div>

	<p class="w-20 text-right font-semibold text-charcoal-900">₹{item.price * item.quantity}</p>

	<button
		type="button"
		onclick={() => cartStore.removeItem(item.id)}
		class="ml-2 text-charcoal-700 hover:text-red-600"
		aria-label={`Remove ${item.productName} from cart`}
	>
		&times;
	</button>
</div>
