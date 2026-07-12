<script lang="ts">
	interface Props {
		id: string;
		label: string;
		value: string;
		error?: string;
		showStrength?: boolean;
		placeholder?: string;
		autocomplete?: 'new-password' | 'current-password';
		oninput?: (value: string) => void;
	}

	let {
		id,
		label,
		value = $bindable(),
		error,
		showStrength = false,
		placeholder = '••••••••',
		autocomplete = 'new-password',
		oninput
	}: Props = $props();

	let visible = $state(false);

	function computeStrength(pwd: string): { score: number; label: string; color: string } {
		let score = 0;
		if (pwd.length >= 8) score++;
		if (/[A-Z]/.test(pwd)) score++;
		if (/[a-z]/.test(pwd)) score++;
		if (/[0-9]/.test(pwd)) score++;
		if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score++;

		const levels = [
			{ label: 'Very Weak', color: 'bg-red-500' },
			{ label: 'Weak', color: 'bg-red-400' },
			{ label: 'Fair', color: 'bg-cream-500' },
			{ label: 'Good', color: 'bg-sage-400' },
			{ label: 'Strong', color: 'bg-sage-600' },
			{ label: 'Excellent', color: 'bg-sage-700' }
		];
		return { score, ...levels[score] };
	}

	const strength = $derived(computeStrength(value ?? ''));
</script>

<div>
	<label for={id} class="label-text">{label}</label>
	<div class="relative">
		<input
			{id}
			type={visible ? 'text' : 'password'}
			bind:value
			{placeholder}
			{autocomplete}
			required
			aria-invalid={!!error}
			aria-describedby={error ? `${id}-error` : undefined}
			oninput={(e) => oninput?.((e.target as HTMLInputElement).value)}
			class={`input-field pr-11 ${error ? 'input-error' : ''}`}
		/>
		<button
			type="button"
			onclick={() => (visible = !visible)}
			class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-charcoal-700 hover:text-bloom-600"
			aria-label={visible ? 'Hide password' : 'Show password'}
		>
			{visible ? 'Hide' : 'Show'}
		</button>
	</div>

	{#if showStrength && value}
		<div class="mt-2">
			<div class="flex h-1.5 gap-1">
				{#each Array(5) as _, i}
					<span class={`flex-1 rounded-full ${i < strength.score ? strength.color : 'bg-charcoal-100'}`}></span>
				{/each}
			</div>
			<p class="mt-1 text-xs text-charcoal-700">{strength.label}</p>
		</div>
	{/if}

	{#if error}
		<p id={`${id}-error`} class="mt-1.5 text-xs text-red-600" role="alert">{error}</p>
	{/if}
</div>
