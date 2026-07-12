export interface KeepsakeType {
	id: string;
	name: string;
	minFlowerWeightGrams: number;
	maxFlowerWeightGrams: number;
	baseProductionDays: number;
	basePrice: number;
	pricePerExtraGram: number;
	wastePercentage: number;
	description: string;
}

export const KEEPSAKE_TYPES: KeepsakeType[] = [
	{
		id: 'resin-frame-small',
		name: 'Small Resin Frame (5x7")',
		minFlowerWeightGrams: 20,
		maxFlowerWeightGrams: 80,
		baseProductionDays: 7,
		basePrice: 1499,
		pricePerExtraGram: 8,
		wastePercentage: 8,
		description: 'A compact resin-cast frame ideal for single-stem or small bouquet preservation.'
	},
	{
		id: 'resin-frame-large',
		name: 'Large Resin Frame (11x14")',
		minFlowerWeightGrams: 60,
		maxFlowerWeightGrams: 250,
		baseProductionDays: 10,
		basePrice: 2999,
		pricePerExtraGram: 6,
		wastePercentage: 10,
		description: 'A statement frame for full bouquets, ideal for wedding or memorial keepsakes.'
	},
	{
		id: 'resin-dome',
		name: 'Resin Dome',
		minFlowerWeightGrams: 15,
		maxFlowerWeightGrams: 60,
		baseProductionDays: 6,
		basePrice: 1299,
		pricePerExtraGram: 9,
		wastePercentage: 7,
		description: 'A glass-like dome preserving blooms in three dimensions.'
	},
	{
		id: 'jewelry-pendant',
		name: 'Botanical Pendant Necklace',
		minFlowerWeightGrams: 1,
		maxFlowerWeightGrams: 10,
		baseProductionDays: 5,
		basePrice: 899,
		pricePerExtraGram: 25,
		wastePercentage: 15,
		description: 'A delicate pendant encasing a single petal or small bloom fragment.'
	},
	{
		id: 'keepsake-box',
		name: 'Preserved Keepsake Box',
		minFlowerWeightGrams: 40,
		maxFlowerWeightGrams: 300,
		baseProductionDays: 9,
		basePrice: 2199,
		pricePerExtraGram: 5,
		wastePercentage: 12,
		description: 'A lined wooden box displaying dried blooms, ideal for memorial keepsakes.'
	},
	{
		id: 'pressed-art-frame',
		name: 'Pressed Botanical Art Frame',
		minFlowerWeightGrams: 10,
		maxFlowerWeightGrams: 100,
		baseProductionDays: 8,
		basePrice: 1799,
		pricePerExtraGram: 7,
		wastePercentage: 10,
		description: 'Flat-pressed flowers arranged into fine art behind UV-protective glass.'
	},
	{
		id: 'shadow-box',
		name: 'Dimensional Shadow Box',
		minFlowerWeightGrams: 80,
		maxFlowerWeightGrams: 400,
		baseProductionDays: 12,
		basePrice: 3499,
		pricePerExtraGram: 6,
		wastePercentage: 14,
		description: 'A deep-set display box preserving full-dimension bouquets and accessories.'
	},
	{
		id: 'ornament',
		name: 'Preserved Flower Ornament',
		minFlowerWeightGrams: 5,
		maxFlowerWeightGrams: 25,
		baseProductionDays: 5,
		basePrice: 699,
		pricePerExtraGram: 12,
		wastePercentage: 10,
		description: 'A hanging glass ornament with preserved petals, perfect for keepsake gifting.'
	}
];

export function getEligibleKeepsakes(weightGrams: number): KeepsakeType[] {
	return KEEPSAKE_TYPES.filter(
		(k) => weightGrams >= k.minFlowerWeightGrams && weightGrams <= k.maxFlowerWeightGrams
	);
}
