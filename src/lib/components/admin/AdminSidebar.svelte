<script lang="ts">
	import { page } from '$app/stores';

	const links = [
		{ href: '/admin', label: 'Overview', icon: '📊' },
		{ href: '/admin/orders', label: 'Orders', icon: '📦' },
		{ href: '/admin/inventory', label: 'Flower Inventory', icon: '🌸' },
		{ href: '/admin/flowers', label: 'Flower Management', icon: '🛠️' },
		{ href: '/admin/manufacturing', label: 'Manufacturing', icon: '🏭' },
		{ href: '/admin/customers', label: 'Customers', icon: '👥' },
		{ href: '/admin/reports', label: 'Reports', icon: '📄' }
	];

	function isActive(href: string): boolean {
		return href === '/admin' ? $page.url.pathname === href : $page.url.pathname.startsWith(href);
	}
</script>

<nav class="w-full shrink-0 lg:w-60" aria-label="Admin navigation">
	<div class="rounded-2xl border border-charcoal-100 bg-white p-3">
		<ul class="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
			{#each links as link}
				<li class="shrink-0 lg:shrink">
					<a
						href={link.href}
						class={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
							isActive(link.href) ? 'bg-bloom-50 text-bloom-700' : 'text-charcoal-700 hover:bg-cream-100'
						}`}
					>
						<span aria-hidden="true">{link.icon}</span>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</nav>
