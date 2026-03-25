import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetUser();
	if (user) redirect(303, '/chat');
	redirect(303, '/auth/login');
};
