import { redirect, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user: authUser } = await locals.safeGetUser();
	if (!authUser) {
		redirect(303, '/auth/login');
	}

	let profile = await db.query.users.findFirst({
		where: eq(users.authId, authUser.id)
	});

	if (!profile) {
		if (!authUser.email) {
			error(400, 'An email address is required to create an account.');
		}
		const [newUser] = await db.insert(users).values({
			authId: authUser.id,
			email: authUser.email
		}).returning();
		profile = newUser;
	}

	if (!profile.onboardingCompleted) {
		redirect(303, '/onboarding');
	}

	const { authId: _, ...safeProfile } = profile;
	return { profile: safeProfile };
};
