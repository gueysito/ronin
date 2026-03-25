import { json, error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, url }) => {
	const { user: authUser } = await locals.safeGetUser();
	if (!authUser) error(401, 'Unauthorized');

	const user = await db.query.users.findFirst({
		where: eq(users.authId, authUser.id)
	});
	if (!user) error(404, 'User not found');

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		payment_method_types: ['card'],
		customer_email: user.email,
		metadata: { userId: user.id },
		line_items: [{
			price_data: {
				currency: 'usd',
				product_data: {
					name: 'MatMentor Pro',
					description: 'AI BJJ coaching - 100 messages/week'
				},
				unit_amount: 999,
				recurring: { interval: 'month' }
			},
			quantity: 1
		}],
		success_url: `${url.origin}/profile?upgraded=true`,
		cancel_url: `${url.origin}/profile`
	});

	return json({ url: session.url });
};
