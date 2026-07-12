<script lang="ts">
	import type { ColorCategory, FlowerCategory, Season } from '$lib/types/flower';

	interface Props {
		category: FlowerCategory | '';
		colorCategory: ColorCategory | '';
		season: Season | '';
		maxPrice: number;
		searchTerm: string;
		onFilterChange: () => void;
	}

	let {
		category = $bindable(),
		colorCategory = $bindable(),
		season = $bindable(),
		maxPrice = $bindable(),
		searchTerm = $bindable(),
		onFilterChange
	}: Props = $props();

	const categories: FlowerCategory[] = [
		'Rose Family',
		'Wildflower',
		'Tropical',
		'Bulb Flower',
		'Herb Flower',
		'Filler Flower',
		'Everlasting'
	];

	const colors: ColorCategory[] = ['Red', 'Pink', 'White', 'Yellow', 'Purple', 'Orange', 'Blue', 'Mixed'];
	const seasons: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter', 'Year-Round'];

	function resetFilters() {
		category = '';
		colorCategory = '';
		season = '';
		maxPrice = 1000;
		searchTerm = '';
		onFilterChange();
	}
</script>

<aside class="w-full shrink-0 lg:w-64" aria-label="Flower filters">
	<div class="rounded-2xl border border-charcoal-100 bg-white p-5">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-display text-lg font-semibold text-charcoal-900">Filters</h2>
			<button type="button" onclick={resetFilters} class="text-xs font-medium text-bloom-600 hover:underline">
				Reset
			</button>
		</div>

		<div class="mb-5">
			<label for="search" class="label-text">Search</label>
			<input
				id="search"
				type="search"
				bind:value={searchTerm}
				oninput={onFilterChange}
				placeholder="Rose, lavender…"
				class="input-field"
			/>
		</div>

		<div class="mb-5">
			<span class="label-text">Category</span>
			<div class="space-y-2">
				{#each categories as cat}
					<label class="flex items-center gap-2 text-sm text-charcoal-700">
						<input
							type="radio"
							name="category"
							value={cat}
							checked={category === cat}
							onchange={() => {
								category = cat;
								onFilterChange();
							}}
							class="h-4 w-4 border-charcoal-100 text-bloom-600"
						/>
						{cat}
					</label>
				{/each}
			</div>
		</div>

		<div class="mb-5">
			<span class="label-text">Color</span>
			<div class="flex flex-wrap gap-2">
				{#each colors as color}
					<button
						type="button"
						onclick={() => {
							colorCategory = colorCategory === color ? '' : color;
							onFilterChange();
						}}
						class={`badge border ${
							colorCategory === color
								? 'border-bloom-600 bg-bloom-600 text-white'
								: 'border-charcoal-100 bg-white text-charcoal-700'
						}`}
					>
						{color}
					</button>
				{/each}
			</div>
		</div>

		<div class="mb-5">
			<span class="label-text">Season</span>
			<select
				bind:value={season}
				onchange={onFilterChange}
				class="input-field"
			>
				<option value="">Any Season</option>
				{#each seasons as s}
					<option value={s}>{s}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="maxPrice" class="label-text">Max Price: ₹{maxPrice}</label>
			<input
				id="maxPrice"
				type="range"
				min="50"
				max="1000"
				step="10"
				bind:value={maxPrice}
				oninput={onFilterChange}
				class="w-full accent-bloom-600"
			/>
		</div>
	</div>
</aside>
