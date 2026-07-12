import { json, error, type RequestHandler } from '@sveltejs/kit';
import { checkoutSchema } from '$lib/schemas/validation';
import { resolveCatalogItems } from '$lib/server/catalog';
import { resolveCouponServer, incrementCouponUsage } from '$lib/server/coupon';
import { calculatePricing, CouponError } from '$lib/services/pricing.service';
import { generateInvoiceNumber, calculateEstimatedDeliveryDate } from '$lib/server/invoice';
import { getAdminDbInstance } from '$lib/server/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { PRODUCTS } from '$lib/constants/products';
import { sanitizePlainText } from '$lib/server/sanitize';
import type { OrderItem } from '$lib/types/product';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAuthenticated || !locals.uid) {
		throw error(401, 'You must be signed in to place an order.');
	}

	const body = await request.json().catch(() => null);
	const result = checkoutSchema.safeParse(body);

	if (!result.success) {
		return json({ error: result.error.issues[0]?.message ?? 'Invalid checkout request.' }, { status: 400 });
	}

	const { items, couponCode, paymentMethod, notes } = result.data;

	const catalogMap = await resolveCatalogItems(items.map((i) => i.productId));

	const orderItems: OrderItem[] = [];
	for (const requestedItem of items) {
		const catalogItem = catalogMap.get(requestedItem.productId);
		if (!catalogItem) {
			return json({ error: 'One of the items in your cart is no longer available.' }, { status: 409 });
		}
		if (!catalogItem.inStock) {
			return json({ error: `${catalogItem.name} is currently out of stock.` }, { status: 409 });
		}
		if (typeof catalogItem.price !== 'number' || Number.isNaN(catalogItem.price)) {
			return json(
				{ error: `${catalogItem.name ?? 'One of the items'} is missing pricing information. Please contact support.` },
				{ status: 409 }
			);
		}
		orderItems.push({
			productId: catalogItem.id,
			productName: catalogItem.name,
			image: catalogItem.image,
			unitPrice: catalogItem.price,
			quantity: requestedItem.quantity,
			lineTotal: catalogItem.price * requestedItem.quantity
		});
	}

	const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

	let coupon = null;
	if (couponCode) {
		coupon = await resolveCouponServer(couponCode);
		if (!coupon) {
			return json({ error: 'Invalid coupon code.' }, { status: 400 });
		}
	}

	let pricing;
	try {
		pricing = calculatePricing(subtotal, coupon);
	} catch (err) {
		if (err instanceof CouponError) {
			return json({ error: err.message }, { status: 400 });
		}
		throw err;
	}

	const invoiceNumber = generateInvoiceNumber();
	const productionDays = orderItems.map((item) => {
		const product = PRODUCTS.find((p) => p.id === item.productId);
		return product?.productionDays ?? 5;
	});
	const estimatedDeliveryDate = calculateEstimatedDeliveryDate(productionDays);

	const isOnlinePayment = paymentMethod !== 'Cash on Delivery' && paymentMethod !== 'Pay on Delivery';

	const orderRef = getAdminDbInstance().collection('orders').doc();
	await orderRef.set({
		uid: locals.uid,
		items: orderItems,
		subtotal: pricing.subtotal,
		discount: pricing.discount,
		couponCode: coupon?.code ?? null,
		tax: pricing.tax,
		shippingFee: pricing.shippingFee,
		total: pricing.total,
		paymentMethod,
		paymentStatus: isOnlinePayment ? 'Paid' : 'Pending',
		orderStatus: 'Confirmed',
		manufacturingProgress: 0,
		createdAt: FieldValue.serverTimestamp(),
		updatedAt: FieldValue.serverTimestamp(),
		estimatedDeliveryDate,
		invoiceNumber,
		notes: notes ? sanitizePlainText(notes, 500) : null
	});

	if (coupon) {
		await incrementCouponUsage(coupon.code);
	}

	await getAdminDbInstance()
		.collection('users')
		.doc(locals.uid)
		.update({ ordersCount: FieldValue.increment(1) })
		.catch(() => {
			/* non-fatal denormalized counter */
		});

	return json({
		orderId: orderRef.id,
		invoiceNumber,
		total: pricing.total,
		paymentStatus: isOnlinePayment ? 'Paid' : 'Pending',
		message: isOnlinePayment ? 'Payment Successful' : 'Order Placed Successfully'
	});
};