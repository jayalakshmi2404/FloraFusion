<script lang="ts">
	interface Benefit {
		icon: string;
		title: string;
		description: string;
	}

	const benefits: Benefit[] = [
		{
			icon: '🏆',
			title: 'Master Craftsmanship',
			description: 'Every keepsake is hand-finished by trained preservation artisans using proven techniques.'
		},
		{
			icon: '⏳',
			title: 'Years of Longevity',
			description: 'Our preservation methods are selected per flower type to maximize lifespan — some pieces last 5+ years.'
		},
		{
			icon: '📦',
			title: 'Tracked Manufacturing',
			description: 'Follow your keepsake in real time from submission through quality check to delivery.'
		},
		{
			icon: '🔒',
			title: 'Secure & Transparent',
			description: 'Encrypted checkout, transparent pricing, and clear order tracking at every step.'
		}
	];
</script>

<section class="bg-sage-50 py-16" aria-labelledby="benefits-heading">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 id="benefits-heading" class="text-center font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
			Why Choose Flora Fusion
		</h2>
		<div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each benefits as benefit}
				<div class="rounded-2xl bg-white p-6 text-center shadow-sm">
					<span class="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-2xl" aria-hidden="true">
						{benefit.icon}
					</span>
					<h3 class="font-display text-lg font-semibold text-charcoal-900">{benefit.title}</h3>
					<p class="mt-2 text-sm text-charcoal-700">{benefit.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
