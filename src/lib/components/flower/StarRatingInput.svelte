<script lang="ts">
	interface Props {
		value: number;
		onChange: (rating: number) => void;
		readonly?: boolean;
		size?: 'sm' | 'md' | 'lg';
	}

	let { value = $bindable(), onChange, readonly = false, size = 'md' }: Props = $props();

	let hovered = $state(0);

	const sizeClasses: Record<string, string> = {
		sm: 'text-lg',
		md: 'text-2xl',
		lg: 'text-3xl'
	};
</script>

<div class="flex items-center gap-1" role={readonly ? undefined : 'radiogroup'} aria-label="Rating">
	{#each [1, 2, 3, 4, 5] as star}
		<button
			type="button"
			disabled={readonly}
			onclick={() => {
				value = star;
				onChange(star);
			}}
			onmouseenter={() => !readonly && (hovered = star)}
			onmouseleave={() => !readonly && (hovered = 0)}
			class={`${sizeClasses[size]} leading-none text-cream-500 transition-transform ${
				readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
			}`}
			aria-label={`${star} star${star > 1 ? 's' : ''}`}
			aria-checked={value === star}
			role={readonly ? undefined : 'radio'}
		>
			{(hovered || value) >= star ? '★' : '☆'}
		</button>
	{/each}
</div>
