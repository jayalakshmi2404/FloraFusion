import { describe, it, expect } from 'vitest';
import { calculateWeightEngine, isWeightWithinGlobalRange, getAllKeepsakeTypes } from '../../src/lib/services/weight-engine.service';

describe('weight-engine.service', () => {
	it('marks extremely small weights as infeasible', () => {
		const result = calculateWeightEngine(0);
		expect(result.productionFeasible).toBe(false);
		expect(result.eligibleKeepsakes).toHaveLength(0);
	});

	it('marks extremely large weights as infeasible', () => {
		const result = calculateWeightEngine(999999);
		expect(result.productionFeasible).toBe(false);
	});

	it('finds eligible keepsakes for a typical bouquet weight', () => {
		const result = calculateWeightEngine(150);
		expect(result.productionFeasible).toBe(true);
		expect(result.eligibleKeepsakes.length).toBeGreaterThan(0);
	});

	it('computes required flower quantity including waste percentage', () => {
		const result = calculateWeightEngine(100);
		expect(result.requiredFlowerQuantityGrams).toBeGreaterThanOrEqual(100);
	});

	it('produces a valid ISO completion date in the future', () => {
		const result = calculateWeightEngine(50);
		expect(new Date(result.estimatedCompletionDate).getTime()).toBeGreaterThan(Date.now());
	});

	it('reduces manufacturing days when rush option is set', () => {
		const standard = calculateWeightEngine(50, { rush: false });
		const rush = calculateWeightEngine(50, { rush: true });
		expect(rush.estimatedManufacturingDays).toBeLessThanOrEqual(standard.estimatedManufacturingDays);
	});

	it('returns a positive estimated cost for feasible weights', () => {
		const result = calculateWeightEngine(30);
		expect(result.estimatedCost).toBeGreaterThan(0);
	});

	it('exposes all configured keepsake types', () => {
		expect(getAllKeepsakeTypes().length).toBeGreaterThan(0);
	});

	it('validates the global feasible weight range', () => {
		expect(isWeightWithinGlobalRange(100)).toBe(true);
		expect(isWeightWithinGlobalRange(0)).toBe(false);
		expect(isWeightWithinGlobalRange(-5)).toBe(false);
		expect(isWeightWithinGlobalRange(10_000_000)).toBe(false);
	});
});
