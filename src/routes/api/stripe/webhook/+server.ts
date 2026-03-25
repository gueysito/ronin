import { json, error } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { users, stripeProcessedEvents } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) error(400, 'Missing signature');

	let event;
	try {
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch {
		error(400, 'Invalid signature');
	}

	// Idempotency: skip already-processed events
	const existing = await db.query.stripeProcessedEvents.findFirst({
		where: eq(stripeProcessedEvents.id, event.id)
	});
	if (existing) {
		return json({ received: true, duplicate: true });
	}

	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object;
			const userId = session.metadata?.userId;
			if (!userId) {
				console.error(`[stripe] checkout.session.completed missing userId in metadata, event: ${event.id}`);
				break;
			}
			await db.update(users)
				.set({ subscriptionTier: 'paid', updatedAt: new Date() })
				.where(eq(users.id, userId));
			break;
		}
		case 'customer.subscription.deleted': {
			const subscription = event.data.object;
			const customer = await stripe.customers.retrieve(subscription.customer as string);
			if ('email' in customer && customer.email) {
				await db.update(users)
					.set({ subscriptionTier: 'free', updatedAt: new Date() })
					.where(eq(users.email, customer.email));
			}
			break;
		}
	}

	// Mark event as processed
	await db.insert(stripeProcessedEvents).values({ id: event.id }).onConflictDoNothing();

	return json({ received: true });
};
