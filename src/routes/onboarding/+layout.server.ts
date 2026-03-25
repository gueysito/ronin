import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user: authUser } = await locals.safeGetUser();
	if (!authUser) redirect(303, '/auth/login');

	let profile = await db.query.users.findFirst({
		where: eq(users.authId, authUser.id)
	});

	if (!profile) {
		const [newUser] = await db
			.insert(users)
			.values({
				authId: authUser.id,
				email: authUser.email!
			})
			.returning();
		profile = newUser;
	}

	if (profile.onboardingCompleted) redirect(303, '/chat');

	return { profile };
};
