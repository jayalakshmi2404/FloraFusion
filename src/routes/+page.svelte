<script lang="ts">
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import FeaturedPlants from '$lib/components/home/FeaturedPlants.svelte';
	import Categories from '$lib/components/home/Categories.svelte';
	import Benefits from '$lib/components/home/Benefits.svelte';
	import Testimonials from '$lib/components/home/Testimonials.svelte';
	import Newsletter from '$lib/components/home/Newsletter.svelte';

	const title = 'Flora Fusion — Preserve Your Flowers Into Lasting Keepsakes';
	const description =
		'Flora Fusion transforms wedding bouquets, memorial flowers, and special-occasion blooms into premium, long-lasting preserved keepsakes.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="/" />
</svelte:head>

<HeroSection />
<FeaturedPlants />
<Categories />
<Benefits />
<Testimonials />
<Newsletter />
