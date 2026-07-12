<script lang="ts">
	interface DataPoint {
		label: string;
		value: number;
	}

	interface Props {
		data: DataPoint[];
		color?: string;
		height?: number;
		valuePrefix?: string;
	}

	let { data, color = '#cf4a7c', height = 220, valuePrefix = '' }: Props = $props();

	const maxValue = $derived(Math.max(1, ...data.map((d) => d.value)));
	const barWidth = $derived(data.length > 0 ? 100 / data.length : 0);
</script>

<div role="img" aria-label="Bar chart">
	<svg viewBox={`0 0 100 ${height / 10}`} preserveAspectRatio="none" class="w-full" style={`height: ${height}px`}>
		{#each data as point, i}
			{@const barHeight = (point.value / maxValue) * (height / 10 - 3)}
			<rect
				x={i * barWidth + barWidth * 0.15}
				y={height / 10 - barHeight - 1}
				width={barWidth * 0.7}
				height={barHeight}
				fill={color}
				rx="0.6"
			>
				<title>{point.label}: {valuePrefix}{point.value}</title>
			</rect>
		{/each}
	</svg>
	<div class="mt-2 flex text-[10px] text-charcoal-700">
		{#each data as point}
			<div class="flex-1 text-center">{point.label}</div>
		{/each}
	</div>
</div>
