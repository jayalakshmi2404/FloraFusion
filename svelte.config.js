import adapterVercel from '@sveltejs/adapter-vercel';
import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Vercel is the primary hosting target (see vercel.json). The Node adapter is
// used only when building the standalone Docker image, selected via the
// BUILD_ADAPTER=node environment variable set in the Dockerfile's build stage.
const adapter =
	process.env.BUILD_ADAPTER === 'node'
		? adapterNode({ out: 'build' })
		: adapterVercel({ runtime: 'nodejs20.x' });

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter,
		alias: {
			$lib: './src/lib',
			$components: './src/lib/components',
			$stores: './src/lib/stores',
			$services: './src/lib/services',
			$repositories: './src/lib/repositories',
			$utils: './src/lib/utils',
			$types: './src/lib/types',
			$constants: './src/lib/constants',
			$schemas: './src/lib/schemas'
		},
		csrf: {
			checkOrigin: true
		}
	}
};

export default config;
