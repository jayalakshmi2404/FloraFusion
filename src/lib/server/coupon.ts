import { getAdminDbInstance } from '$lib/server/firebase-admin';
import { findCoupon } from '$lib/constants/coupons';
import type { Coupon } from '$lib/types/product';

export async function resolveCouponServer(code: string): Promise<Coupon | null> {
	try {
		const snap = await getAdminDbInstance().collection('coupons').doc(code.trim().toUpperCase()).get();
		if (snap.exists) return snap.data() as Coupon;
	} catch {
		/* fall through to local */
	}
	return findCoupon(code);
}

export async function incrementCouponUsage(code: string): Promise<void> {
	try {
		const ref = getAdminDbInstance().collection('coupons').doc(code.trim().toUpperCase());
		const snap = await ref.get();
		if (snap.exists) {
			await ref.update({ usedCount: (snap.data()?.usedCount ?? 0) + 1 });
		}
	} catch {
		/* non-fatal: usage tracking on the local constant fallback is not persisted */
	}
}
