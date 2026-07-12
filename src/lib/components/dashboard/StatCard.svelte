<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		icon: string;
		trend?: string;
		trendPositive?: boolean;
	}

	let { label, value, icon, trend, trendPositive = true }: Props = $props();
</script>

<div class="rounded-2xl border border-charcoal-100 bg-white p-5">
	<div class="flex items-center justify-between">
		<span class="flex h-10 w-10 items-center justify-center rounded-full bg-bloom-50 text-xl" aria-hidden="true">
			{icon}
		</span>
		{#if trend}
			<span class={`text-xs font-semibold ${trendPositive ? 'text-sage-600' : 'text-red-600'}`}>{trend}</span>
		{/if}
	</div>
	<p class="mt-4 font-display text-2xl font-semibold text-charcoal-900">{value}</p>
	<p class="text-sm text-charcoal-700">{label}</p>
</div>
