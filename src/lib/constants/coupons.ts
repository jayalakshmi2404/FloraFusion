import type { Coupon } from '$lib/types/product';

export const COUPONS: Coupon[] = [
	{
		code: 'WELCOME10',
		type: 'percentage',
		value: 10,
		minOrderValue: 500,
		maxDiscount: 500,
		expiresAt: '2027-12-31T23:59:59.000Z',
		usageLimit: 100000,
		usedCount: 0,
		active: true
	},
	{
		code: 'BLOOM250',
		type: 'flat',
		value: 250,
		minOrderValue: 1500,
		maxDiscount: null,
		expiresAt: '2027-12-31T23:59:59.000Z',
		usageLimit: 50000,
		usedCount: 0,
		active: true
	},
	{
		code: 'WEDDING15',
		type: 'percentage',
		value: 15,
		minOrderValue: 3000,
		maxDiscount: 1500,
		expiresAt: '2027-12-31T23:59:59.000Z',
		usageLimit: 20000,
		usedCount: 0,
		active: true
	},
	{
		code: 'FIRSTORDER',
		type: 'flat',
		value: 150,
		minOrderValue: 0,
		maxDiscount: null,
		expiresAt: '2027-12-31T23:59:59.000Z',
		usageLimit: 100000,
		usedCount: 0,
		active: true
	}
];

export function findCoupon(code: string): Coupon | null {
	return COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase()) ?? null;
}
