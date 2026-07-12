import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { verifySessionCookie } from '$lib/server/firebase-admin';
import { rateLimit, getClientIp } from '$lib/server/rate-limit';

const ADMIN_ROUTES = ['/admin'];
const USER_PROTECTED_ROUTES = ['/dashboard', '/orders', '/wishlist', '/checkout', '/profile', '/submit-flower'];
const AUTH_ONLY_ROUTES = ['/login', '/register', '/forgot-password'];

const handleSession: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('__session');

	event.locals.uid = null;
	event.locals.email = null;
	event.locals.role = null;
	event.locals.isAuthenticated = false;

	if (sessionCookie) {
		const decoded = await verifySessionCookie(sessionCookie);
		if (decoded) {
			event.locals.uid = decoded.uid;
			event.locals.email = decoded.email ?? null;
			event.locals.role = (decoded.role as 'user' | 'admin') ?? 'user';
			event.locals.isAuthenticated = true;
		} else {
			event.cookies.delete('__session', { path: '/' });
		}
	}

	return resolve(event);
};

const handleRouteGuard: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	if (ADMIN_ROUTES.some((route) => path.startsWith(route)) && path !== '/admin/login') {
		if (!event.locals.isAuthenticated || event.locals.role !== 'admin') {
			return new Response(null, {
				status: 302,
				headers: { location: `/login?redirectTo=${encodeURIComponent(path)}&as=admin` }
			});
		}
	}

	if (USER_PROTECTED_ROUTES.some((route) => path.startsWith(route))) {
		if (!event.locals.isAuthenticated) {
			return new Response(null, {
				status: 302,
				headers: { location: `/login?redirectTo=${encodeURIComponent(path)}` }
			});
		}
	}

	if (AUTH_ONLY_ROUTES.some((route) => path.startsWith(route)) && event.locals.isAuthenticated) {
		const destination = event.locals.role === 'admin' ? '/admin' : '/dashboard';
		return new Response(null, { status: 302, headers: { location: destination } });
	}

	return resolve(event);
};

const handleApiRateLimit: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/')) {
		const ip = getClientIp(event.request, event.getClientAddress);
		const key = `${ip}:${event.url.pathname}`;
		const maxRequests = event.url.pathname.startsWith('/api/auth') ? 10 : 60;
		const result = rateLimit(key, maxRequests, 60_000);

		if (!result.allowed) {
			return new Response(JSON.stringify({ error: 'Too many requests. Please slow down.' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString()
				}
			});
		}
	}

	return resolve(event);
};

const handleCsrf: Handle = async ({ event, resolve }) => {
	const method = event.request.method;
	if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && event.url.pathname.startsWith('/api/')) {
		const origin = event.request.headers.get('origin');
		const host = event.request.headers.get('host');
		if (origin && host) {
			const originHost = new URL(origin).host;
			if (originHost !== host) {
				return new Response(JSON.stringify({ error: 'Cross-site request blocked.' }), {
					status: 403,
					headers: { 'Content-Type': 'application/json' }
				});
			}
		}
	}
	return resolve(event);
};

const handleSecurityHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' https://www.gstatic.com https://apis.google.com",
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
			"font-src 'self' https://fonts.gstatic.com",
			"img-src 'self' data: blob: https://firebasestorage.googleapis.com https://res.cloudinary.com",
			"connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
			"frame-src 'self' https://*.firebaseapp.com",
			"object-src 'none'",
			"base-uri 'self'"
		].join('; ')
	);

	if (event.url.protocol === 'https:') {
		response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
	}

	return response;
};

export const handle = sequence(
	handleSession,
	handleCsrf,
	handleApiRateLimit,
	handleRouteGuard,
	handleSecurityHeaders
);

export const handleError: HandleServerError = ({ error, event }) => {
	console.error(`[error] ${event.url.pathname}:`, error);
	return {
		message: 'An unexpected error occurred. Please try again or contact florafusion111@gmail.com.',
		code: 'INTERNAL_ERROR'
	};
};