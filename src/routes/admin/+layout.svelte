<script lang="ts">
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import type { PageData } from './$types';

	let { children, data }: { children: any; data: PageData } = $props();
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
	<div class="mb-6 flex items-center justify-between rounded-2xl bg-charcoal-900 px-5 py-3 text-white">
		<span class="text-sm font-medium">Flora Fusion Admin Console</span>
		<span class="text-xs text-charcoal-100">{data.adminEmail}</span>
	</div>

	<div class="flex flex-col gap-8 lg:flex-row">
		<AdminSidebar />
		<div class="min-w-0 flex-1">
			{@render children()}
		</div>
	</div>
</div>
