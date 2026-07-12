/// <reference types="@sveltejs/kit" />

declare module '$env/static/public' {
	export const PUBLIC_FIREBASE_API_KEY: string;
	export const PUBLIC_FIREBASE_AUTH_DOMAIN: string;
	export const PUBLIC_FIREBASE_PROJECT_ID: string;
	export const PUBLIC_FIREBASE_STORAGE_BUCKET: string;
	export const PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
	export const PUBLIC_FIREBASE_APP_ID: string;
	export const PUBLIC_FIREBASE_MEASUREMENT_ID: string;
	export const PUBLIC_USE_FIREBASE_EMULATORS: string;
	export const PUBLIC_SITE_URL: string;
	export const PUBLIC_CONTACT_EMAIL: string;
}

declare module '$env/static/private' {
	export const FIREBASE_ADMIN_PROJECT_ID: string;
	export const FIREBASE_ADMIN_CLIENT_EMAIL: string;
	export const FIREBASE_ADMIN_PRIVATE_KEY: string;
	export const FIREBASE_ADMIN_STORAGE_BUCKET: string;
	export const SESSION_COOKIE_SECRET: string;
	export const RATE_LIMIT_MAX_REQUESTS: string;
	export const RATE_LIMIT_WINDOW_MS: string;
}
