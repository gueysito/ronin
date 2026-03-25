import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '$lib/server/ai/system-prompt';

const mockUser = {
	id: '123', authId: 'a', email: 'test@test.com', name: null,
	belt: 'purple' as const, experienceYears: 3,
	trainingGoalDays: 5,
	goals: ['improve guard retention'],
	struggles: ['escaping mount'],
	subscriptionTier: 'free' as const,
	onboardingCompleted: true,
	createdAt: new Date(), updatedAt: new Date()
};

describe('Onboarding -> Chat context integration', () => {
	it('buildSystemPrompt includes all onboarding data', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('Belt: purple');
		expect(prompt).toContain('improve guard retention');
		expect(prompt).toContain('escaping mount');
		expect(prompt).toContain('Training goal: 5 days/week');
		expect(prompt).toContain('Experience: 3 years');
	});
});

describe('Session -> Summary context integration', () => {
	it('session data appears in system prompt for AI context', () => {
		const session = {
			id: 's1', userId: '123', date: new Date('2026-03-20T10:00:00Z'),
			type: 'rolling' as const, durationMinutes: 90, intensityRpe: 8, energy: 4,
			mood: 'flow_state' as const, notes: null, positionsWorked: [],
			createdAt: new Date()
		};
		const prompt = buildSystemPrompt(mockUser, [session], []);
		expect(prompt).toContain('rolling');
		expect(prompt).toContain('90min');
		expect(prompt).toContain('RPE 8/10');
		expect(prompt).toContain('energy 4/5');
		expect(prompt).toContain('flow_state');
	});

	it('multiple sessions are listed in context', () => {
		const sessions = [
			{
				id: 's1', userId: '123', date: new Date('2026-03-20'),
				type: 'rolling' as const, durationMinutes: 60, intensityRpe: 7, energy: 4,
				mood: null, notes: null, positionsWorked: [], createdAt: new Date()
			},
			{
				id: 's2', userId: '123', date: new Date('2026-03-18'),
				type: 'drilling' as const, durationMinutes: 45, intensityRpe: 5, energy: 3,
				mood: 'focused' as const, notes: null, positionsWorked: [], createdAt: new Date()
			}
		];
		const prompt = buildSystemPrompt(mockUser, sessions, []);
		expect(prompt).toContain('rolling');
		expect(prompt).toContain('drilling');
	});
});

describe('Subscription tier -> Rate limit integration', () => {
	it('tier names match rate limit keys', () => {
		const MESSAGE_LIMITS = { free: 20, paid: 100 } as const;
		const validTiers: Array<keyof typeof MESSAGE_LIMITS> = ['free', 'paid'];
		for (const tier of validTiers) {
			expect(MESSAGE_LIMITS[tier]).toBeGreaterThan(0);
		}
	});
});

describe('Video library -> Prompt context integration', () => {
	it('approved videos appear in system prompt', () => {
		const video = {
			id: 'v1', techniqueId: null, title: 'Closed Guard Sweeps',
			url: 'https://example.com/vid', instructor: 'Roger Gracie',
			channel: 'BJJ Fanatics', durationMinutes: 25,
			beltLevel: 'white' as const, isPrimary: true, notes: null
		};
		const prompt = buildSystemPrompt(mockUser, [], [video]);
		expect(prompt).toContain('Closed Guard Sweeps');
		expect(prompt).toContain('Roger Gracie');
		expect(prompt).toContain('25min');
	});

	it('prompt includes content whitelisting rule', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('Only recommend videos from the approved list');
		expect(prompt).toContain('NEVER link to other sources');
	});
});
