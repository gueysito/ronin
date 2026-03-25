import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { techniques } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allTechniques = await db.query.techniques.findMany({
		orderBy: [asc(techniques.sortOrder)]
	});

	return {
		techniques: allTechniques.map((t) => ({
			slug: t.slug,
			name: t.name,
			domain: t.domain,
			beltLevel: t.beltLevel
		}))
	};
};
