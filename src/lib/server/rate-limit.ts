interface Bucket {
	count: number;
	resetAt: number;
}

const buckets = new Map<string, Bucket>();

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_REQUESTS = 30;

export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	resetAt: number;
}

export function rateLimit(
	key: string,
	maxRequests: number = DEFAULT_MAX_REQUESTS,
	windowMs: number = DEFAULT_WINDOW_MS
): RateLimitResult {
	const now = Date.now();
	const existing = buckets.get(key);

	if (!existing || existing.resetAt <= now) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
	}

	if (existing.count >= maxRequests) {
		return { allowed: false, remaining: 0, resetAt: existing.resetAt };
	}

	existing.count += 1;
	buckets.set(key, existing);
	return { allowed: true, remaining: maxRequests - existing.count, resetAt: existing.resetAt };
}

export function clearExpiredBuckets(): void {
	const now = Date.now();
	for (const [key, bucket] of buckets.entries()) {
		if (bucket.resetAt <= now) buckets.delete(key);
	}
}

if (typeof setInterval !== 'undefined') {
	setInterval(clearExpiredBuckets, 5 * 60_000);
}

export function getClientIp(request: Request, getClientAddress: () => string): string {
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0].trim();
	try {
		return getClientAddress();
	} catch {
		return 'unknown';
	}
}
