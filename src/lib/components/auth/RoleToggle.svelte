<script lang="ts">
	import type { UserRole } from '$lib/types/user';

	interface Props {
		value: UserRole;
		onChange: (role: UserRole) => void;
	}

	let { value, onChange }: Props = $props();
</script>

<div class="grid grid-cols-2 gap-2 rounded-full bg-cream-100 p-1" role="tablist" aria-label="Login as">
	<button
		type="button"
		role="tab"
		aria-selected={value === 'user'}
		onclick={() => onChange('user')}
		class={`rounded-full py-2 text-sm font-semibold transition-all ${
			value === 'user' ? 'bg-white text-bloom-700 shadow-sm' : 'text-charcoal-700'
		}`}
	>
		Login as User
	</button>
	<button
		type="button"
		role="tab"
		aria-selected={value === 'admin'}
		onclick={() => onChange('admin')}
		class={`rounded-full py-2 text-sm font-semibold transition-all ${
			value === 'admin' ? 'bg-white text-bloom-700 shadow-sm' : 'text-charcoal-700'
		}`}
	>
		Login as Admin
	</button>
</div>
