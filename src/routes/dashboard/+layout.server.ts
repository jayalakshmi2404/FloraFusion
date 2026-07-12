import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.isAuthenticated) {
		throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}
	return {};
};
