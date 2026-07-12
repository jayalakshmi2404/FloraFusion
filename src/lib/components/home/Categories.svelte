<script lang="ts">
	interface CategoryTile {
		name: string;
		emoji: string;
		description: string;
		href: string;
		color: string;
	}

	const categories: CategoryTile[] = [
		{
			name: 'Rose Family',
			emoji: '🌹',
			description: 'Roses, peonies & ranunculus',
			href: '/flowers?category=Rose+Family',
			color: 'bg-bloom-50 text-bloom-700'
		},
		{
			name: 'Everlasting',
			emoji: '🌼',
			description: 'Naturally long-lasting blooms',
			href: '/flowers?category=Everlasting',
			color: 'bg-cream-100 text-cream-500'
		},
		{
			name: 'Wildflower',
			emoji: '🌻',
			description: 'Sunflowers, zinnias & daisies',
			href: '/flowers?category=Wildflower',
			color: 'bg-sage-50 text-sage-700'
		},
		{
			name: 'Tropical',
			emoji: '🌺',
			description: 'Orchids & proteas',
			href: '/flowers?category=Tropical',
			color: 'bg-bloom-100 text-bloom-700'
		},
		{
			name: 'Bulb Flower',
			emoji: '🌷',
			description: 'Tulips, lilies & iris',
			href: '/flowers?category=Bulb+Flower',
			color: 'bg-cream-100 text-charcoal-800'
		},
		{
			name: 'Herb Flower',
			emoji: '💐',
			description: 'Lavender & jasmine',
			href: '/flowers?category=Herb+Flower',
			color: 'bg-sage-100 text-sage-700'
		}
	];
</script>

<section class="bg-white py-16" aria-labelledby="categories-heading">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<h2 id="categories-heading" class="text-center font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
			Shop by Category
		</h2>
		<div class="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
			{#each categories as category}
				<a
					href={category.href}
					class="group flex flex-col items-center gap-3 rounded-2xl border border-charcoal-100 p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
				>
					<span class={`flex h-16 w-16 items-center justify-center rounded-full text-3xl ${category.color}`} aria-hidden="true">
						{category.emoji}
					</span>
					<span class="font-display text-sm font-semibold text-charcoal-900">{category.name}</span>
					<span class="text-xs text-charcoal-700">{category.description}</span>
				</a>
			{/each}
		</div>
	</div>
</section>
