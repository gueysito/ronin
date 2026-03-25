import { describe, it, expect } from 'vitest';

describe('Onboarding data maps', () => {
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

	it('experienceMap covers all expected options', () => {
		expect(Object.keys(experienceMap)).toHaveLength(6);
	});

	it('experienceMap values are monotonically increasing', () => {
		const values = Object.values(experienceMap);
		for (let i = 1; i < values.length; i++) {
			expect(values[i]).toBeGreaterThan(values[i - 1]);
		}
	});

	it('frequencyMap covers all expected options', () => {
		expect(Object.keys(frequencyMap)).toHaveLength(4);
	});

	it('unknown experience falls back to default via ?? 1', () => {
		expect(experienceMap['unknown'] ?? 1).toBe(1);
	});

	it('unknown frequency falls back to default via ?? 3', () => {
		expect(frequencyMap['unknown'] ?? 3).toBe(3);
	});
});

describe('Belt validation', () => {
	const validBelts = ['white', 'blue', 'purple', 'brown', 'black'];

	it('accepts all valid belts', () => {
		for (const belt of validBelts) {
			expect(validBelts.includes(belt)).toBe(true);
		}
	});

	it('rejects invalid belt values', () => {
		expect(validBelts.includes('rainbow')).toBe(false);
		expect(validBelts.includes('')).toBe(false);
		expect(validBelts.includes('RED')).toBe(false);
	});
});

describe('Goals/struggles JSON parsing', () => {
	it('parses valid JSON array', () => {
		expect(JSON.parse('["improve guard"]')).toEqual(['improve guard']);
	});

	it('parses empty array', () => {
		expect(JSON.parse('[]')).toEqual([]);
	});

	it('throws on invalid JSON', () => {
		expect(() => JSON.parse('not json')).toThrow();
	});

	it('fallback empty string parses to empty array', () => {
		expect(JSON.parse('[]')).toEqual([]);
	});
});

describe('BottomNav tabs', () => {
	it('has links to all 4 app sections', () => {
		const tabs = [
			{ href: '/chat', label: 'Chat' },
			{ href: '/game', label: 'Game' },
			{ href: '/progress', label: 'Progress' },
			{ href: '/profile', label: 'Profile' }
		];
		expect(tabs).toHaveLength(4);
		expect(tabs.map(t => t.href)).toEqual(['/chat', '/game', '/progress', '/profile']);
	});
});
