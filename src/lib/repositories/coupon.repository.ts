import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';
import type { Coupon } from '$lib/types/product';
import { COUPONS, findCoupon as findLocalCoupon } from '$lib/constants/coupons';

const COUPONS_COLLECTION = 'coupons';

export async function getCouponByCode(code: string): Promise<Coupon | null> {
	try {
		const snap = await getDoc(doc(db, COUPONS_COLLECTION, code.trim().toUpperCase()));
		if (snap.exists()) return snap.data() as Coupon;
	} catch {
		/* fall through to local */
	}
	return findLocalCoupon(code);
}

export async function listActiveCoupons(): Promise<Coupon[]> {
	try {
		const snap = await getDocs(collection(db, COUPONS_COLLECTION));
		if (!snap.empty) return snap.docs.map((d) => d.data() as Coupon).filter((c) => c.active);
	} catch {
		/* fall through */
	}
	return COUPONS.filter((c) => c.active);
}
