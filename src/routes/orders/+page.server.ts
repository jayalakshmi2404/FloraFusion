import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.isAuthenticated) {
		throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}
	return {};
};
