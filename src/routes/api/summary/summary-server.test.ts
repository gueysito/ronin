import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '$lib/server/ai/system-prompt';

const mockUser = {
	id: '123', authId: 'a', email: 'test@test.com', name: null,
	belt: 'blue' as const, experienceYears: 2,
	trainingGoalDays: 4,
	goals: ['improve guard retention', 'learn leg locks'],
	struggles: ['escaping mount', 'passing half guard'],
	subscriptionTier: 'free' as const,
	onboardingCompleted: true,
	createdAt: new Date(), updatedAt: new Date()
};

describe('buildSystemPrompt — XML data delimitation', () => {
	it('wraps user profile in <user_profile> tags', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('<user_profile>');
		expect(prompt).toContain('</user_profile>');
	});

	it('wraps sessions in <recent_sessions> tags', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('<recent_sessions>');
		expect(prompt).toContain('</recent_sessions>');
	});

	it('wraps videos in <approved_video_library> tags', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('<approved_video_library>');
		expect(prompt).toContain('</approved_video_library>');
	});

	it('includes data-not-instructions preamble', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('NOT instructions');
	});
});

describe('buildSystemPrompt — content correctness', () => {
	it('includes user belt level', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('Belt: blue');
	});

	it('includes goals and struggles', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('improve guard retention, learn leg locks');
		expect(prompt).toContain('escaping mount, passing half guard');
	});

	it('includes training goal days', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('Training goal: 4 days/week');
	});

	it('shows "Not set" for missing goals', () => {
		const noGoals = { ...mockUser, goals: null as unknown as string[] };
		const prompt = buildSystemPrompt(noGoals, [], []);
		expect(prompt).toContain('Goals: Not set');
	});

	it('formats session dates as ISO (not locale-dependent)', () => {
		const session = {
			id: 's1', userId: '123', date: new Date('2026-03-20T10:00:00Z'),
			type: 'rolling' as const, durationMinutes: 60, intensityRpe: 7, energy: 4,
			mood: 'focused' as const, notes: null, positionsWorked: [],
			createdAt: new Date()
		};
		const prompt = buildSystemPrompt(mockUser, [session], []);
		expect(prompt).toContain('2026-03-20');
		expect(prompt).not.toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // no locale dates like 3/20/2026
	});

	it('includes session details (type, duration, RPE, energy, mood)', () => {
		const session = {
			id: 's1', userId: '123', date: new Date('2026-03-20'),
			type: 'drilling' as const, durationMinutes: 45, intensityRpe: 5, energy: 3,
			mood: 'focused' as const, notes: null, positionsWorked: [],
			createdAt: new Date()
		};
		const prompt = buildSystemPrompt(mockUser, [session], []);
		expect(prompt).toContain('drilling');
		expect(prompt).toContain('45min');
		expect(prompt).toContain('RPE 5/10');
		expect(prompt).toContain('energy 3/5');
	});

	it('includes video details when provided', () => {
		const video = {
			id: 'v1', techniqueId: null, title: 'Guard Retention Masterclass',
			url: 'https://example.com/video', instructor: 'John Danaher',
			channel: null, durationMinutes: 30, beltLevel: 'blue' as const,
			isPrimary: true, notes: null
		};
		const prompt = buildSystemPrompt(mockUser, [], [video]);
		expect(prompt).toContain('Guard Retention Masterclass');
		expect(prompt).toContain('John Danaher');
		expect(prompt).toContain('30min');
	});

	it('includes safety directives', () => {
		const prompt = buildSystemPrompt(mockUser, [], []);
		expect(prompt).toContain('NEVER provide medical advice');
		expect(prompt).toContain('NEVER encourage training through injury');
	});
});
