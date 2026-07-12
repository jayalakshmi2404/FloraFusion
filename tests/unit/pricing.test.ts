import { describe, it, expect } from 'vitest';
import {
	calculateShippingFee,
	calculateTax,
	validateCoupon,
	calculatePricing,
	CouponError,
	FREE_SHIPPING_THRESHOLD,
	TAX_RATE
} from '../../src/lib/services/pricing.service';
import type { Coupon } from '../../src/lib/types/product';

function buildCoupon(overrides: Partial<Coupon> = {}): Coupon {
	return {
		code: 'TESTCODE',
		type: 'flat',
		value: 100,
		minOrderValue: 0,
		maxDiscount: null,
		expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
		usageLimit: 100,
		usedCount: 0,
		active: true,
		...overrides
	};
}

describe('pricing.service', () => {
	it('charges standard shipping below the free threshold', () => {
		expect(calculateShippingFee(FREE_SHIPPING_THRESHOLD - 1)).toBeGreaterThan(0);
	});

	it('gives free shipping at or above the threshold', () => {
		expect(calculateShippingFee(FREE_SHIPPING_THRESHOLD)).toBe(0);
	});

	it('charges no shipping for a zero subtotal', () => {
		expect(calculateShippingFee(0)).toBe(0);
	});

	it('calculates tax using the configured tax rate', () => {
		expect(calculateTax(1000)).toBe(Math.round(1000 * TAX_RATE));
	});

	it('returns zero discount when no coupon is applied', () => {
		expect(validateCoupon(null, 1000)).toBe(0);
	});

	it('applies a flat discount coupon correctly', () => {
		const coupon = buildCoupon({ type: 'flat', value: 200 });
		expect(validateCoupon(coupon, 1000)).toBe(200);
	});

	it('applies a percentage discount coupon correctly', () => {
		const coupon = buildCoupon({ type: 'percentage', value: 10 });
		expect(validateCoupon(coupon, 1000)).toBe(100);
	});

	it('caps percentage discounts at maxDiscount', () => {
		const coupon = buildCoupon({ type: 'percentage', value: 50, maxDiscount: 100 });
		expect(validateCoupon(coupon, 1000)).toBe(100);
	});

	it('rejects an expired coupon', () => {
		const coupon = buildCoupon({ expiresAt: new Date(Date.now() - 1000).toISOString() });
		expect(() => validateCoupon(coupon, 1000)).toThrow(CouponError);
	});

	it('rejects a coupon that has hit its usage limit', () => {
		const coupon = buildCoupon({ usageLimit: 5, usedCount: 5 });
		expect(() => validateCoupon(coupon, 1000)).toThrow(CouponError);
	});

	it('rejects a coupon below the minimum order value', () => {
		const coupon = buildCoupon({ minOrderValue: 2000 });
		expect(() => validateCoupon(coupon, 1000)).toThrow(CouponError);
	});

	it('rejects an inactive coupon', () => {
		const coupon = buildCoupon({ active: false });
		expect(() => validateCoupon(coupon, 1000)).toThrow(CouponError);
	});

	it('never discounts more than the subtotal itself', () => {
		const coupon = buildCoupon({ type: 'flat', value: 5000 });
		expect(validateCoupon(coupon, 1000)).toBe(1000);
	});

	it('computes a full pricing breakdown with no coupon', () => {
		const pricing = calculatePricing(1000, null);
		expect(pricing.subtotal).toBe(1000);
		expect(pricing.discount).toBe(0);
		expect(pricing.tax).toBe(Math.round(1000 * TAX_RATE));
		expect(pricing.total).toBe(pricing.taxableAmount + pricing.tax + pricing.shippingFee);
	});

	it('computes a full pricing breakdown with a coupon applied', () => {
		const coupon = buildCoupon({ type: 'flat', value: 200 });
		const pricing = calculatePricing(1000, coupon);
		expect(pricing.discount).toBe(200);
		expect(pricing.taxableAmount).toBe(800);
	});
});
