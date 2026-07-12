<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-bloom-100 bg-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-10 md:grid-cols-4">
			<div>
				<div class="flex items-center gap-2 font-display text-2xl font-semibold text-bloom-700">
					<img src="/images/logo.png" alt="Flora Fusion" class="h-7 w-7 rounded-full object-cover" /> Flora Fusion
				</div>
				<p class="mt-3 max-w-xs text-sm text-charcoal-700">
					Turning your most meaningful flowers into lasting keepsakes, preserved with care and craftsmanship.
				</p>
			</div>

			<div>
				<h3 class="font-display text-lg font-semibold text-charcoal-900">Shop</h3>
				<ul class="mt-3 space-y-2 text-sm text-charcoal-700">
					<li><a href="/flowers" class="hover:text-bloom-600">Preserved Flowers</a></li>
					<li><a href="/products" class="hover:text-bloom-600">Keepsakes</a></li>
					<li><a href="/submit-flower" class="hover:text-bloom-600">Submit Your Flowers</a></li>
				</ul>
			</div>

			<div>
				<h3 class="font-display text-lg font-semibold text-charcoal-900">Account</h3>
				<ul class="mt-3 space-y-2 text-sm text-charcoal-700">
					<li><a href="/login" class="hover:text-bloom-600">Sign In</a></li>
					<li><a href="/register" class="hover:text-bloom-600">Create Account</a></li>
					<li><a href="/orders" class="hover:text-bloom-600">Track Order</a></li>
				</ul>
			</div>

			<div>
				<h3 class="font-display text-lg font-semibold text-charcoal-900">Contact</h3>
				<p class="mt-3 text-sm text-charcoal-700">For all inquiries, reach us at:</p>
				<a href="mailto:florafusion111@gmail.com" class="mt-1 inline-block text-sm font-medium text-bloom-600 hover:underline">
					florafusion111@gmail.com
				</a>
			</div>
		</div>

		<div class="mt-10 border-t border-charcoal-100 pt-6 text-center text-xs text-charcoal-700">
			&copy; {year} Flora Fusion. All rights reserved.
		</div>
	</div>
</footer>