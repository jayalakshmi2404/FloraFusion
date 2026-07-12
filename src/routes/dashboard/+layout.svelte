<script lang="ts">
	import DashboardSidebar from '$lib/components/dashboard/DashboardSidebar.svelte';

	let { children } = $props();
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-8 lg:flex-row">
		<DashboardSidebar />
		<div class="min-w-0 flex-1">
			{@render children()}
		</div>
	</div>
</div>
