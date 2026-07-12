<script lang="ts">
	import { page } from '$app/stores';

	const links = [
		{ href: '/dashboard', label: 'Overview', icon: '🏠' },
		{ href: '/dashboard/submissions', label: 'My Submissions', icon: '🌿' },
		{ href: '/orders', label: 'Orders', icon: '📦' },
		{ href: '/wishlist', label: 'Wishlist', icon: '♡' },
		{ href: '/dashboard/reviews', label: 'My Reviews', icon: '⭐' },
		{ href: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
		{ href: '/profile', label: 'Profile Settings', icon: '⚙️' }
	];

	function isActive(href: string): boolean {
		return href === '/dashboard' ? $page.url.pathname === href : $page.url.pathname.startsWith(href);
	}
</script>

<nav class="w-full shrink-0 lg:w-60" aria-label="Dashboard navigation">
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
