export type ProductWorkflow =
	| 'Standard'
	| 'Custom Design'
	| 'Rush Production'
	| 'Bulk Order';

export interface ProductInventory {
	inStock: boolean;
	quantityAvailable: number;
	restockDate: string | null;
}
export interface Product {
	id: string;
	name: string;
	slug: string;
	category: string;
	price: number;
	compareAtPrice: number | null;
	minFlowerWeightGrams: number;
	maxFlowerWeightGrams: number;
	productionDays: number;
	workflow: ProductWorkflow;
	description: string;
	shortDescription: string;
	gallery: string[];
	mainImage: string;
	inventory: ProductInventory;
	rating: number;
	reviewCount: number;
	tags: string[];
	isFeatured: boolean;
	isCustomizable: boolean;
}

export interface CartItem {
	id: string;
	productId: string;
	productName: string;
	image: string;
	price: number;
	quantity: number;
	customization?: {
		flowerSubmissionId?: string;
		notes?: string;
	};
}

export type PaymentMethod =
	| 'UPI'
	| 'Credit Card'
	| 'Debit Card'
	| 'Net Banking'
	| 'Cash on Delivery'
	| 'Pay on Delivery';

export type OrderStatus =
	| 'Pending'
	| 'Confirmed'
	| 'In Production'
	| 'Quality Check'
	| 'Shipped'
	| 'Delivered'
	| 'Cancelled';

export interface OrderItem {
	productId: string;
	productName: string;
	image: string;
	unitPrice: number;
	quantity: number;
	lineTotal: number;
}

export interface Order {
	id: string;
	uid: string;
	items: OrderItem[];
	subtotal: number;
	discount: number;
	couponCode: string | null;
	tax: number;
	shippingFee: number;
	total: number;
	paymentMethod: PaymentMethod;
	paymentStatus: 'Paid' | 'Pending' | 'Failed';
	orderStatus: OrderStatus;
	manufacturingProgress: number;
	createdAt: string;
	updatedAt: string;
	estimatedDeliveryDate: string;
	invoiceNumber: string;
	notes: string | null;
}

export interface Coupon {
	code: string;
	type: 'percentage' | 'flat';
	value: number;
	minOrderValue: number;
	maxDiscount: number | null;
	expiresAt: string;
	usageLimit: number;
	usedCount: number;
	active: boolean;
}

export interface WishlistItem {
	id: string;
	productId: string;
	productName: string;
	image: string;
	price: number;
	addedAt: string;
}
