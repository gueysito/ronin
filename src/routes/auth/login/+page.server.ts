import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetUser();
	if (user) redirect(303, '/chat');
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return fail(400, { success: false, message: 'Email is required.' });
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${url.origin}/auth/confirm`
			}
		});

		if (error) {
			return fail(400, { success: false, message: 'Could not send magic link. Try again.' });
		}

		return { success: true, message: 'Check your email for a magic link.' };
	}
};
