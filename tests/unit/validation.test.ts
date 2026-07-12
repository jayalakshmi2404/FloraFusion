import { describe, it, expect } from 'vitest';
import {
	fullNameSchema,
	emailSchema,
	passwordSchema,
	registerSchema,
	flowerSubmissionSchema
} from '../../src/lib/schemas/validation';

describe('fullNameSchema', () => {
	it('rejects names shorter than 3 characters', () => {
		expect(fullNameSchema.safeParse('Al').success).toBe(false);
	});

	it('rejects meaningless placeholder names', () => {
		for (const name of ['aa', 'admin', 'test', 'xyz', '123', 'hello']) {
			expect(fullNameSchema.safeParse(name).success).toBe(false);
		}
	});

	it('accepts a real, meaningful name', () => {
		expect(fullNameSchema.safeParse('Ananya Rao').success).toBe(true);
	});

	it('rejects names with digits or symbols', () => {
		expect(fullNameSchema.safeParse('John123').success).toBe(false);
	});
});

describe('emailSchema', () => {
	it('accepts common providers', () => {
		expect(emailSchema.safeParse('person@gmail.com').success).toBe(true);
		expect(emailSchema.safeParse('person@outlook.com').success).toBe(true);
		expect(emailSchema.safeParse('person@yahoo.com').success).toBe(true);
	});

	it('accepts custom domains', () => {
		expect(emailSchema.safeParse('person@customcompany.io').success).toBe(true);
	});

	it('rejects malformed email addresses', () => {
		expect(emailSchema.safeParse('not-an-email').success).toBe(false);
		expect(emailSchema.safeParse('missing@domain').success).toBe(false);
	});
});

describe('passwordSchema', () => {
	it('rejects passwords missing required character classes', () => {
		expect(passwordSchema.safeParse('alllowercase').success).toBe(false);
		expect(passwordSchema.safeParse('ALLUPPERCASE1!').success).toBe(false);
		expect(passwordSchema.safeParse('NoNumber!').success).toBe(false);
		expect(passwordSchema.safeParse('NoSpecial123').success).toBe(false);
	});

	it('rejects passwords shorter than 8 characters', () => {
		expect(passwordSchema.safeParse('Ab1!').success).toBe(false);
	});

	it('accepts a strong password', () => {
		expect(passwordSchema.safeParse('Str0ng!Pass').success).toBe(true);
	});
});

describe('registerSchema', () => {
	it('rejects mismatched password confirmation', () => {
		const result = registerSchema.safeParse({
			fullName: 'Ananya Rao',
			email: 'ananya@example.com',
			password: 'Str0ng!Pass',
			confirmPassword: 'Different1!'
		});
		expect(result.success).toBe(false);
	});

	it('accepts a fully valid registration payload', () => {
		const result = registerSchema.safeParse({
			fullName: 'Ananya Rao',
			email: 'ananya@example.com',
			password: 'Str0ng!Pass',
			confirmPassword: 'Str0ng!Pass'
		});
		expect(result.success).toBe(true);
	});
});

describe('flowerSubmissionSchema', () => {
	const futureDate = new Date(Date.now() + 7 * 86_400_000).toISOString();

	it('rejects a submission with no photos', () => {
		const result = flowerSubmissionSchema.safeParse({
			flowerType: 'Wedding bouquet',
			flowerWeightGrams: 150,
			occasion: 'Wedding',
			preferredDeliveryDate: futureDate,
			photos: []
		});
		expect(result.success).toBe(false);
	});

	it('rejects a delivery date in the past', () => {
		const result = flowerSubmissionSchema.safeParse({
			flowerType: 'Wedding bouquet',
			flowerWeightGrams: 150,
			occasion: 'Wedding',
			preferredDeliveryDate: new Date(Date.now() - 86_400_000).toISOString(),
			photos: ['https://example.com/photo.jpg']
		});
		expect(result.success).toBe(false);
	});

	it('accepts a fully valid submission', () => {
		const result = flowerSubmissionSchema.safeParse({
			flowerType: 'Wedding bouquet',
			flowerWeightGrams: 150,
			occasion: 'Wedding',
			preferredDeliveryDate: futureDate,
			photos: ['https://example.com/photo.jpg']
		});
		expect(result.success).toBe(true);
	});
});
