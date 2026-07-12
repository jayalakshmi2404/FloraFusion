<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
</script>

<section class="relative overflow-hidden bg-gradient-to-b from-bloom-50 via-cream-50 to-cream-50">
	<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
		<div class="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-bloom-200/40 blur-3xl"></div>
		<div class="absolute -right-32 top-32 h-96 w-96 rounded-full bg-sage-200/40 blur-3xl"></div>
		<span class="absolute left-[8%] top-24 animate-float text-5xl opacity-60 sm:text-6xl">🌸</span>
		<span class="absolute right-[10%] top-52 animate-float text-4xl opacity-50 [animation-delay:1.5s] sm:text-5xl">🌷</span>
		<span class="absolute bottom-16 left-[20%] animate-float text-4xl opacity-40 [animation-delay:3s] sm:text-5xl">🌺</span>
	</div>

	<div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
		<div class="mx-auto max-w-3xl text-center">
			<span class="badge mb-6 bg-bloom-100 text-bloom-700">Premium Floral Preservation</span>
			<h1 class="animate-slide-up font-display text-4xl font-semibold leading-tight text-charcoal-900 sm:text-5xl lg:text-6xl">
				Turn your most meaningful flowers into
				<span class="text-bloom-600">forever keepsakes</span>
			</h1>
			<p class="mx-auto mt-6 max-w-xl animate-slide-up text-lg text-charcoal-700 [animation-delay:0.1s]">
				From wedding bouquets to memorial tributes, Flora Fusion preserves your flowers with
				master craftsmanship — designed to last a lifetime.
			</p>
			<div class="mt-10 flex flex-col items-center justify-center gap-4 animate-slide-up [animation-delay:0.2s] sm:flex-row">
				<Button href="/submit-flower" size="lg" variant="primary">Submit Your Flowers</Button>
				<Button href="/flowers" size="lg" variant="secondary">Explore Preserved Flowers</Button>
			</div>
		</div>
	</div>
</section>
