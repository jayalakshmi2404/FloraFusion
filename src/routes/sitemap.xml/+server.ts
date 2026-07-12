import type { RequestHandler } from './$types';
import { FLOWERS } from '$lib/constants/flowers';
import { PRODUCTS } from '$lib/constants/products';

export const GET: RequestHandler = async ({ url }) => {
	const staticRoutes = ['/', '/flowers', '/products', '/about', '/submit-flower', '/login', '/register'];

	const flowerRoutes = FLOWERS.map((f) => `/flowers/${f.id}`);
	const productRoutes = PRODUCTS.map((p) => `/products/${p.id}`);

	const allRoutes = [...staticRoutes, ...flowerRoutes, ...productRoutes];

	const urlEntries = allRoutes
		.map(
			(route) => `  <url>
    <loc>${url.origin}${route}</loc>
    <changefreq>${route === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.7'}</priority>
  </url>`
		)
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml' }
	});
};
