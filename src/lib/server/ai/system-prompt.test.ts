import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from './system-prompt';

const mockUser = {
	id: '123',
	authId: 'auth-123',
	email: 'test@test.com',
	name: null,
	belt: 'blue' as const,
	experienceYears: 2.5,
	trainingGoalDays: 4,
	goals: ['improve guard passing', 'learn leg locks'],
	struggles: ['escaping side control'],
	subscriptionTier: 'free' as const,
	onboardingCompleted: true,
	createdAt: new Date(),
	updatedAt: new Date()
};

const mockSession = {
	id: 'sess-1',
	userId: '123',
	date: new Date('2026-03-20'),
	type: 'rolling' as const,
	durationMinutes: 60,
	intensityRpe: 7,
	energy: 4,
	mood: 'focused' as const,
	notes: null,
	positionsWorked: ['closed_guard'],
	createdAt: new Date()
};

const mockVideo = {
	id: 'vid-1',
	techniqueId: 'tech-1',
	title: 'Basic Guard Pass',
	url: 'https://example.com/video',
	instructor: 'John Danaher',
	channel: 'BJJ Fanatics',
	durationMinutes: 15,
	beltLevel: 'white' as const,
	isPrimary: true,
	notes: null
};

describe('buildSystemPrompt', () => {
	it('includes user profile data', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('Belt: blue');
		expect(prompt).toContain('Experience: 2.5 years');
		expect(prompt).toContain('Training goal: 4 days/week');
		expect(prompt).toContain('improve guard passing');
		expect(prompt).toContain('escaping side control');
	});

	it('includes recent sessions when provided', () => {
		const prompt = buildSystemPrompt(mockUser, [mockSession], []);
		expect(prompt).toContain('rolling');
		expect(prompt).toContain('60min');
		expect(prompt).toContain('RPE 7/10');
	});

	it('shows "No sessions logged yet" when no sessions', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('No sessions logged yet');
	});

	it('includes approved videos', () => {
		const prompt = buildSystemPrompt(mockUser, [], [mockVideo]);
		expect(prompt).toContain('Basic Guard Pass');
		expect(prompt).toContain('John Danaher');
	});

	it('includes Musashi persona', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('Musashi');
	});

	it('includes safety rules (no medical advice)', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('NEVER provide medical advice');
	});

	it('includes content rules (only approved videos)', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('Only recommend videos from the approved list');
	});

	it('handles user with no goals/struggles', () => {
		const userNoGoals = { ...mockUser, goals: null as unknown as string[], struggles: null as unknown as string[] };
		const prompt = buildSystemPrompt(userNoGoals, [], []);
		expect(prompt).toContain('Goals: Not set');
		expect(prompt).toContain('Struggles: Not set');
	});
});
