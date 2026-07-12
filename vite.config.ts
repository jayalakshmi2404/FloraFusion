import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173
	},
	build: {
		target: 'esnext',
		sourcemap: false
	},
	optimizeDeps: {
		include: ['three', 'firebase/app', 'firebase/auth', 'firebase/firestore']
	},
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/unit/**/*.{test,spec}.{js,ts}']
	}
});
