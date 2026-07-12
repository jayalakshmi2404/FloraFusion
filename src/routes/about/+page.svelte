<script lang="ts">
	const steps = [
		{
			title: 'Submit Your Flowers',
			description: 'Tell us about your event and upload photos of the flowers you\'d like preserved.',
			icon: '🌷'
		},
		{
			title: 'We Calculate Feasibility',
			description: 'Our weight engine determines which keepsakes are possible and estimates cost and timeline.',
			icon: '⚖️'
		},
		{
			title: 'Expert Preservation',
			description: 'Our artisans use silica drying, pressing, glycerin, freeze-drying, or resin casting — whichever suits your flowers best.',
			icon: '🎨'
		},
		{
			title: 'Crafted Into a Keepsake',
			description: 'Your preserved flowers are handcrafted into your chosen keepsake, from resin frames to jewelry.',
			icon: '🛠️'
		},
		{
			title: 'Delivered to You',
			description: 'Track progress the whole way, then receive your finished piece, ready to treasure.',
			icon: '📦'
		}
	];

	const preservationMethods = [
		{ name: 'Silica Gel Drying', description: 'Best for full-shape retention on delicate, layered blooms like roses and peonies.' },
		{ name: 'Pressed Preservation', description: 'Flattens flowers for framed botanical art and long-lasting filler foliage.' },
		{ name: 'Glycerin Preservation', description: 'Keeps small, fragrant blooms soft and pliable, ideal for jasmine and similar flowers.' },
		{ name: 'Freeze-Drying', description: 'Preserves dimension and color for waxy or dramatic blooms like orchids and lilies.' },
		{ name: 'Resin Casting', description: 'Encases flowers in crystal-clear resin for frames, jewelry, and home decor.' }
	];
</script>

<svelte:head>
	<title>About Flora Fusion — Our Craft & Process</title>
	<meta name="description" content="Learn how Flora Fusion preserves your most meaningful flowers into lasting keepsakes, and the craftsmanship behind every piece." />
</svelte:head>

<div class="bg-gradient-to-b from-bloom-50 to-cream-50 py-16">
	<div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<span class="badge bg-bloom-100 text-bloom-700">Our Story</span>
		<h1 class="mt-4 font-display text-4xl font-semibold text-charcoal-900 sm:text-5xl">
			Every Flower Tells a Story Worth Keeping
		</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-charcoal-700">
			Flora Fusion was founded on a simple belief: the flowers from your most meaningful moments
			deserve to last far longer than a week in a vase. We combine traditional preservation
			craftsmanship with modern design to turn your blooms into keepsakes you'll treasure for years.
		</p>
	</div>
</div>

<section class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="process-heading">
	<h2 id="process-heading" class="text-center font-display text-3xl font-semibold text-charcoal-900">Our Process</h2>
	<div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
		{#each steps as step, i}
			<div class="relative rounded-2xl border border-charcoal-100 bg-white p-5 text-center">
				<span class="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-bloom-600 text-xs font-bold text-white">
					{i + 1}
				</span>
				<span class="mt-3 block text-3xl" aria-hidden="true">{step.icon}</span>
				<h3 class="mt-3 font-display font-semibold text-charcoal-900">{step.title}</h3>
				<p class="mt-2 text-sm text-charcoal-700">{step.description}</p>
			</div>
		{/each}
	</div>
</section>

<section class="bg-sage-50 py-16" aria-labelledby="methods-heading">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<h2 id="methods-heading" class="text-center font-display text-3xl font-semibold text-charcoal-900">
			Preservation Methods We Use
		</h2>
		<div class="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
			{#each preservationMethods as method}
				<div class="rounded-2xl bg-white p-5">
					<h3 class="font-display font-semibold text-charcoal-900">{method.name}</h3>
					<p class="mt-1 text-sm text-charcoal-700">{method.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
	<h2 class="font-display text-3xl font-semibold text-charcoal-900">Have Questions?</h2>
	<p class="mt-3 text-charcoal-700">
		We're happy to help with anything from choosing a keepsake to tracking your order.
	</p>
	<a href="mailto:florafusion111@gmail.com" class="btn-primary mt-6 inline-flex">
		Email florafusion111@gmail.com
	</a>
</section>