import type { Coupon } from '$lib/types/product';

export const TAX_RATE = 0.05; // 5% GST on handcrafted keepsake goods
export const FREE_SHIPPING_THRESHOLD = 2000;
export const STANDARD_SHIPPING_FEE = 149;

export interface PricingBreakdown {
	subtotal: number;
	discount: number;
	taxableAmount: number;
	tax: number;
	shippingFee: number;
	total: number;
}

export class CouponError extends Error {}

export function calculateShippingFee(subtotal: number): number {
	if (subtotal <= 0) return 0;
	return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function calculateTax(taxableAmount: number): number {
	return Math.round(taxableAmount * TAX_RATE);
}

export function validateCoupon(coupon: Coupon | null, subtotal: number): number {
	if (!coupon) return 0;

	if (!coupon.active) {
		throw new CouponError('This coupon is no longer active.');
	}
	if (new Date(coupon.expiresAt).getTime() < Date.now()) {
		throw new CouponError('This coupon has expired.');
	}
	if (coupon.usedCount >= coupon.usageLimit) {
		throw new CouponError('This coupon has reached its usage limit.');
	}
	if (subtotal < coupon.minOrderValue) {
		throw new CouponError(`This coupon requires a minimum order of ₹${coupon.minOrderValue}.`);
	}

	let discount = coupon.type === 'percentage' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;

	if (coupon.maxDiscount !== null) {
		discount = Math.min(discount, coupon.maxDiscount);
	}

	return Math.min(discount, subtotal);
}

export function calculatePricing(subtotal: number, coupon: Coupon | null = null): PricingBreakdown {
	const discount = validateCoupon(coupon, subtotal);
	const taxableAmount = Math.max(0, subtotal - discount);
	const tax = calculateTax(taxableAmount);
	const shippingFee = calculateShippingFee(taxableAmount);
	const total = taxableAmount + tax + shippingFee;

	return { subtotal, discount, taxableAmount, tax, shippingFee, total };
}
