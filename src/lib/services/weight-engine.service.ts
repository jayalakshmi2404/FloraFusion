import { KEEPSAKE_TYPES, getEligibleKeepsakes } from '$lib/constants/keepsakes';
import type { WeightEngineResult } from '$lib/types/flower';

const MIN_FEASIBLE_WEIGHT_GRAMS = 1;
const MAX_PROCESSABLE_WEIGHT_GRAMS = 5000;
const RUSH_THRESHOLD_DAYS_SAVED = 0;

export interface WeightEngineOptions {
	rush?: boolean;
}

export function calculateWeightEngine(
	weightGrams: number,
	options: WeightEngineOptions = {}
): WeightEngineResult {
	const eligible = getEligibleKeepsakes(weightGrams);
	const productionFeasible =
		weightGrams >= MIN_FEASIBLE_WEIGHT_GRAMS &&
		weightGrams <= MAX_PROCESSABLE_WEIGHT_GRAMS &&
		eligible.length > 0;

	if (!productionFeasible) {
		return {
			eligibleKeepsakes: [],
			requiredFlowerQuantityGrams: weightGrams,
			productionFeasible: false,
			wastePercentage: 0,
			estimatedManufacturingDays: 0,
			estimatedCompletionDate: '',
			estimatedCost: 0
		};
	}

	const bestMatch = eligible.reduce((best, current) => {
		const bestMid = (best.minFlowerWeightGrams + best.maxFlowerWeightGrams) / 2;
		const currentMid = (current.minFlowerWeightGrams + current.maxFlowerWeightGrams) / 2;
		return Math.abs(currentMid - weightGrams) < Math.abs(bestMid - weightGrams) ? current : best;
	}, eligible[0]);

	const wastePercentage = bestMatch.wastePercentage;
	const requiredFlowerQuantityGrams = Math.ceil(weightGrams * (1 + wastePercentage / 100));

	const extraGrams = Math.max(0, weightGrams - bestMatch.minFlowerWeightGrams);
	const estimatedCost = Math.round(
		bestMatch.basePrice + extraGrams * bestMatch.pricePerExtraGram
	);

	const manufacturingDays = options.rush
		? Math.max(2, bestMatch.baseProductionDays - 3 - RUSH_THRESHOLD_DAYS_SAVED)
		: bestMatch.baseProductionDays;

	const completionDate = new Date();
	completionDate.setDate(completionDate.getDate() + manufacturingDays);

	return {
		eligibleKeepsakes: eligible.map((k) => k.name),
		requiredFlowerQuantityGrams,
		productionFeasible: true,
		wastePercentage,
		estimatedManufacturingDays: manufacturingDays,
		estimatedCompletionDate: completionDate.toISOString(),
		estimatedCost
	};
}

export function getAllKeepsakeTypes() {
	return KEEPSAKE_TYPES;
}

export function isWeightWithinGlobalRange(weightGrams: number): boolean {
	return weightGrams >= MIN_FEASIBLE_WEIGHT_GRAMS && weightGrams <= MAX_PROCESSABLE_WEIGHT_GRAMS;
}
