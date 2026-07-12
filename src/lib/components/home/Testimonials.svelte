<script lang="ts">
	interface Testimonial {
		name: string;
		occasion: string;
		quote: string;
		rating: number;
	}

	const testimonials: Testimonial[] = [
		{
			name: 'Ananya R.',
			occasion: 'Wedding Bouquet Keepsake',
			quote:
				'The resin frame they made from my wedding bouquet looks exactly like the day I got married. The detail is incredible.',
			rating: 5
		},
		{
			name: 'Karthik M.',
			occasion: 'Memorial Preservation',
			quote:
				'They handled my grandmother\'s memorial flowers with so much care. The keepsake box means the world to my family.',
			rating: 5
		},
		{
			name: 'Priya S.',
			occasion: 'Anniversary Gift',
			quote:
				'Tracking the manufacturing progress online made the wait exciting instead of stressful. Beautifully packaged too.',
			rating: 4
		}
	];
</script>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="testimonials-heading">
	<h2 id="testimonials-heading" class="text-center font-display text-3xl font-semibold text-charcoal-900 sm:text-4xl">
		Stories from Our Customers
	</h2>
	<div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
		{#each testimonials as testimonial}
			<figure class="card-glass flex flex-col p-6">
				<div class="mb-3 flex text-cream-500" aria-label={`Rated ${testimonial.rating} out of 5`}>
					{#each Array(5) as _, i}
						<span aria-hidden="true">{i < testimonial.rating ? '★' : '☆'}</span>
					{/each}
				</div>
				<blockquote class="flex-1 text-sm italic text-charcoal-800">"{testimonial.quote}"</blockquote>
				<figcaption class="mt-4 border-t border-charcoal-100 pt-4">
					<p class="text-sm font-semibold text-charcoal-900">{testimonial.name}</p>
					<p class="text-xs text-charcoal-700">{testimonial.occasion}</p>
				</figcaption>
			</figure>
		{/each}
	</div>
</section>
