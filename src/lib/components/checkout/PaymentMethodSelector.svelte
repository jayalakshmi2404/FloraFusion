<script lang="ts">
	import type { PaymentMethod } from '$lib/types/product';

	interface Props {
		value: PaymentMethod;
		onChange: (method: PaymentMethod) => void;
	}

	let { value, onChange }: Props = $props();

	const methods: { id: PaymentMethod; label: string; icon: string; group: 'Online' | 'Offline' }[] = [
		{ id: 'UPI', label: 'UPI', icon: '📱', group: 'Online' },
		{ id: 'Credit Card', label: 'Credit Card', icon: '💳', group: 'Online' },
		{ id: 'Debit Card', label: 'Debit Card', icon: '💳', group: 'Online' },
		{ id: 'Net Banking', label: 'Net Banking', icon: '🏦', group: 'Online' },
		{ id: 'Cash on Delivery', label: 'Cash on Delivery', icon: '💵', group: 'Offline' },
		{ id: 'Pay on Delivery', label: 'Pay on Delivery (Card/UPI)', icon: '🚚', group: 'Offline' }
	];
</script>

<div>
	<p class="label-text">Online Payment</p>
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each methods.filter((m) => m.group === 'Online') as method}
			<button
				type="button"
				onclick={() => onChange(method.id)}
				class={`flex flex-col items-center gap-1 rounded-xl border p-4 text-center transition-colors ${
					value === method.id ? 'border-bloom-600 bg-bloom-50' : 'border-charcoal-100 hover:bg-cream-100'
				}`}
			>
				<span class="text-2xl" aria-hidden="true">{method.icon}</span>
				<span class="text-xs font-medium text-charcoal-900">{method.label}</span>
			</button>
		{/each}
	</div>

	<p class="label-text mt-5">Offline Payment</p>
	<div class="grid grid-cols-2 gap-3">
		{#each methods.filter((m) => m.group === 'Offline') as method}
			<button
				type="button"
				onclick={() => onChange(method.id)}
				class={`flex flex-col items-center gap-1 rounded-xl border p-4 text-center transition-colors ${
					value === method.id ? 'border-bloom-600 bg-bloom-50' : 'border-charcoal-100 hover:bg-cream-100'
				}`}
			>
				<span class="text-2xl" aria-hidden="true">{method.icon}</span>
				<span class="text-xs font-medium text-charcoal-900">{method.label}</span>
			</button>
		{/each}
	</div>
</div>
