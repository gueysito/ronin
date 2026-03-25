import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { user: authUser } = await locals.safeGetUser();
		if (!authUser) redirect(303, '/auth/login');

		const formData = await request.formData();
		const belt = formData.get('belt') as string;
		const experience = formData.get('experience') as string;
		const trainingFrequency = formData.get('trainingFrequency') as string;
		let goals: string[] = [];
		let struggles: string[] = [];
		try {
			goals = JSON.parse((formData.get('goals') as string) || '[]');
			struggles = JSON.parse((formData.get('struggles') as string) || '[]');
		} catch {
			return fail(400, { message: 'Invalid goals or struggles format' });
		}
		const destination = formData.get('destination') as string;

		const experienceMap: Record<string, number> = {
			'Less than 6 months': 0.25,
			'6-12 months': 0.75,
			'1-2 years': 1.5,
			'2-3 years': 2.5,
			'3-5 years': 4,
			'5+ years': 6
		};

		const frequencyMap: Record<string, number> = {
			'1-2 days': 2,
			'3-4 days': 4,
			'5-6 days': 6,
			'Every day': 7
		};

		const validBelts = ['white', 'blue', 'purple', 'brown', 'black'] as const;
		if (!belt || !validBelts.includes(belt as typeof validBelts[number])) {
			return fail(400, { message: 'Invalid belt level' });
		}

		await db
			.update(users)
			.set({
				belt: belt as typeof validBelts[number],
				experienceYears: experienceMap[experience] ?? 1,
				trainingGoalDays: frequencyMap[trainingFrequency] ?? 3,
				goals,
				struggles,
				onboardingCompleted: true,
				updatedAt: new Date()
			})
			.where(eq(users.authId, authUser.id));

		redirect(303, destination === 'log' ? '/chat' : '/chat');
	}
};
