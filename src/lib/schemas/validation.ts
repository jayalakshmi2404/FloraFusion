import { z } from 'zod';

const MEANINGLESS_NAMES = new Set([
	'aa',
	'bb',
	'cc',
	'dd',
	'ee',
	'ff',
	'gg',
	'hh',
	'ii',
	'jj',
	'kk',
	'll',
	'admin',
	'user',
	'test',
	'hello',
	'abc',
	'xyz',
	'123'
]);

function isMeaninglessName(name: string): boolean {
	const normalized = name.trim().toLowerCase();
	if (MEANINGLESS_NAMES.has(normalized)) return true;
	const collapsedRepeats = /^(.)\1+$/.test(normalized.replace(/\s/g, ''));
	if (collapsedRepeats) return true;
	if (!/[a-zA-Z]/.test(normalized)) return true;
	return false;
}

export const fullNameSchema = z
	.string()
	.trim()
	.min(3, 'Full name must be at least 3 characters long')
	.max(80, 'Full name is too long')
	.regex(/^[a-zA-Z\u00C0-\u024F\u0900-\u097F' -]+$/, 'Full name contains invalid characters')
	.refine((name) => !isMeaninglessName(name), {
		message: 'Please enter your real full name'
	})
	.refine((name) => name.trim().split(/\s+/).length >= 1, {
		message: 'Full name is required'
	});

export const emailSchema = z
	.string()
	.trim()
	.toLowerCase()
	.min(5, 'Email is too short')
	.max(254, 'Email is too long')
	.regex(
		/^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\])$/,
		'Please enter a valid email address'
	);

export const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters long')
	.max(128, 'Password is too long')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/[0-9]/, 'Password must contain at least one number')
	.regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, 'Password must contain at least one special character');

export const registerSchema = z
	.object({
		fullName: fullNameSchema,
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, 'Password is required'),
	role: z.enum(['user', 'admin'])
});

export const forgotPasswordSchema = z.object({
	email: emailSchema
});

export const resetPasswordSchema = z
	.object({
		oobCode: z.string().min(1),
		newPassword: passwordSchema,
		confirmPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export const updateProfileSchema = z.object({
	fullName: fullNameSchema.optional(),
	photoURL: z.string().url().nullable().optional(),
	notificationsEnabled: z.boolean().optional()
});

export const flowerSubmissionSchema = z.object({
	flowerType: z.string().trim().min(2, 'Please specify the flower type').max(120),
	flowerWeightGrams: z.coerce.number().positive('Weight must be greater than 0').max(50000),
	occasion: z.enum([
		'Wedding',
		'Birthday',
		'Anniversary',
		'Memorial',
		'Graduation',
		'Corporate Event',
		'Religious Event'
	]),
	description: z.string().trim().max(1000).optional().default(''),
	preferredDeliveryDate: z
		.string()
		.refine((val) => !Number.isNaN(Date.parse(val)), 'Please provide a valid date')
		.refine((val) => new Date(val).getTime() > Date.now(), 'Delivery date must be in the future'),
	photos: z.array(z.string().url()).min(1, 'Please upload at least one photo').max(10)
});

export const addToCartSchema = z.object({
	productId: z.string().min(1),
	quantity: z.coerce.number().int().min(1).max(50),
	customization: z
		.object({
			flowerSubmissionId: z.string().optional(),
			notes: z.string().max(500).optional()
		})
		.optional()
});

export const checkoutSchema = z.object({
	items: z
		.array(
			z.object({
				productId: z.string(),
				quantity: z.number().int().min(1)
			})
		)
		.min(1, 'Your cart is empty'),
	couponCode: z.string().trim().optional().nullable(),
	paymentMethod: z.enum([
		'UPI',
		'Credit Card',
		'Debit Card',
		'Net Banking',
		'Cash on Delivery',
		'Pay on Delivery'
	]),
	notes: z.string().max(500).optional().nullable()
});

export const reviewSchema = z.object({
	targetId: z.string().min(1),
	rating: z.number().int().min(1).max(5),
	comment: z.string().trim().min(5, 'Please write at least 5 characters').max(600)
});

export const couponValidationSchema = z.object({
	code: z.string().trim().min(1, 'Coupon code is required'),
	orderValue: z.number().positive()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type FlowerSubmissionInput = z.infer<typeof flowerSubmissionSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
