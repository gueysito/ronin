import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { techniques, contentLinks } from '../src/lib/server/db/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is required');

const client = postgres(DATABASE_URL);
const db = drizzle(client);

// ─── Technique Taxonomy (50 techniques from homework 04) ───

const techniquesData: (typeof techniques.$inferInsert)[] = [
	// Domain 1: Takedowns (9)
	{ name: 'Double Leg Takedown', slug: 'double_leg', domain: 'takedowns', position: 'standing', beltLevel: 'white', synonyms: [], sortOrder: 1 },
	{ name: 'Single Leg Takedown', slug: 'single_leg', domain: 'takedowns', position: 'standing', beltLevel: 'white', synonyms: [], sortOrder: 2 },
	{ name: 'Body Lock Takedown', slug: 'body_lock', domain: 'takedowns', position: 'standing', beltLevel: 'blue', synonyms: [], sortOrder: 3 },
	{ name: 'O Soto Gari', slug: 'o_soto_gari', domain: 'takedowns', position: 'standing', beltLevel: 'blue', synonyms: ['Outside Reap', 'Osoto'], sortOrder: 4 },
	{ name: 'O Uchi Gari', slug: 'o_uchi_gari', domain: 'takedowns', position: 'standing', beltLevel: 'blue', synonyms: ['Inside Reap', 'Ouchi'], sortOrder: 5 },
	{ name: 'O Goshi', slug: 'o_goshi', domain: 'takedowns', position: 'standing', beltLevel: 'blue', synonyms: ['Hip Throw', 'Ogoshi'], sortOrder: 6 },
	{ name: 'Guard Pull', slug: 'guard_pull', domain: 'takedowns', position: 'standing', beltLevel: 'white', synonyms: [], sortOrder: 7 },
	{ name: 'Snap Down to Front Headlock', slug: 'snap_down', domain: 'takedowns', position: 'standing', beltLevel: 'purple', synonyms: [], sortOrder: 8 },
	{ name: 'Collar Drag', slug: 'collar_drag', domain: 'takedowns', position: 'standing', beltLevel: 'blue', isGiOnly: true, synonyms: [], sortOrder: 9 },

	// Domain 2: Guard Play — Sweeps (12)
	{ name: 'Scissor Sweep', slug: 'scissor_sweep', domain: 'guard', position: 'closed_guard', beltLevel: 'white', synonyms: [], sortOrder: 10 },
	{ name: 'Hip Bump Sweep', slug: 'hip_bump', domain: 'guard', position: 'closed_guard', beltLevel: 'white', synonyms: ['Sit-Up Sweep'], sortOrder: 11 },
	{ name: 'Pendulum Sweep', slug: 'pendulum_sweep', domain: 'guard', position: 'closed_guard', beltLevel: 'blue', synonyms: ['Flower Sweep'], sortOrder: 12 },
	{ name: 'Lumberjack Sweep', slug: 'lumberjack_sweep', domain: 'guard', position: 'closed_guard', beltLevel: 'blue', synonyms: [], sortOrder: 13 },
	{ name: 'Tripod Sweep', slug: 'tripod_sweep', domain: 'guard', position: 'open_guard', beltLevel: 'blue', synonyms: [], sortOrder: 14 },
	{ name: 'Sickle Sweep', slug: 'sickle_sweep', domain: 'guard', position: 'open_guard', beltLevel: 'blue', synonyms: [], sortOrder: 15 },
	{ name: 'Butterfly Sweep', slug: 'butterfly_sweep', domain: 'guard', position: 'butterfly_guard', beltLevel: 'blue', synonyms: ['Hook Sweep'], sortOrder: 16 },
	{ name: 'De La Riva Sweep', slug: 'dlr_sweep', domain: 'guard', position: 'de_la_riva', beltLevel: 'purple', synonyms: ['DLR Sweep'], sortOrder: 17 },
	{ name: 'X-Guard Sweep', slug: 'x_guard_sweep', domain: 'guard', position: 'x_guard', beltLevel: 'purple', synonyms: ['Technical Stand-Up Sweep'], sortOrder: 18 },
	{ name: 'Half Guard Underhook Sweep', slug: 'half_guard_sweep', domain: 'guard', position: 'half_guard', beltLevel: 'blue', synonyms: ['Old School Sweep'], sortOrder: 19 },
	{ name: 'Lasso Sweep', slug: 'lasso_sweep', domain: 'guard', position: 'spider_guard', beltLevel: 'purple', isGiOnly: true, synonyms: [], sortOrder: 20 },
	{ name: 'Spider Guard Sweep', slug: 'spider_sweep', domain: 'guard', position: 'spider_guard', beltLevel: 'purple', isGiOnly: true, synonyms: [], sortOrder: 21 },

	// Domain 3: Guard Passing (10)
	{ name: 'Knee Cut Pass', slug: 'knee_cut', domain: 'passing', position: 'guard_top', beltLevel: 'blue', synonyms: ['Knee Slice', 'Knee Slide'], sortOrder: 22 },
	{ name: 'Torreando Pass', slug: 'torreando', domain: 'passing', position: 'guard_top', beltLevel: 'blue', synonyms: ['Bullfighter Pass', 'Toreando'], sortOrder: 23 },
	{ name: 'Double Under Pass', slug: 'double_under', domain: 'passing', position: 'guard_top', beltLevel: 'blue', synonyms: ['Stack Pass'], sortOrder: 24 },
	{ name: 'Over-Under Pass', slug: 'over_under', domain: 'passing', position: 'guard_top', beltLevel: 'purple', synonyms: [], sortOrder: 25 },
	{ name: 'Leg Drag Pass', slug: 'leg_drag', domain: 'passing', position: 'guard_top', beltLevel: 'purple', synonyms: [], sortOrder: 26 },
	{ name: 'Half Guard Pressure Pass', slug: 'half_guard_pass', domain: 'passing', position: 'half_guard_top', beltLevel: 'blue', synonyms: ['Smash Pass'], sortOrder: 27 },
	{ name: 'Backstep Pass', slug: 'backstep', domain: 'passing', position: 'guard_top', beltLevel: 'purple', synonyms: [], sortOrder: 28 },
	{ name: 'Sao Paulo Pass', slug: 'sao_paulo', domain: 'passing', position: 'guard_top', beltLevel: 'purple', synonyms: ['Folding Pass'], sortOrder: 29 },
	{ name: 'Standing Guard Break', slug: 'standing_break', domain: 'passing', position: 'closed_guard_top', beltLevel: 'white', synonyms: [], sortOrder: 30 },
	{ name: 'Long Step Pass', slug: 'long_step', domain: 'passing', position: 'guard_top', beltLevel: 'purple', synonyms: [], sortOrder: 31 },

	// Domain 4: Escapes (7)
	{ name: 'Bridge and Roll Escape', slug: 'upa_escape', domain: 'escapes', position: 'mount_bottom', beltLevel: 'white', synonyms: ['Upa Escape'], sortOrder: 32 },
	{ name: 'Elbow-Knee Escape', slug: 'elbow_knee', domain: 'escapes', position: 'mount_bottom', beltLevel: 'white', synonyms: ['Shrimp Escape'], sortOrder: 33 },
	{ name: 'Frame and Shrimp Escape', slug: 'frame_shrimp', domain: 'escapes', position: 'side_control_bottom', beltLevel: 'white', synonyms: [], sortOrder: 34 },
	{ name: 'Back Escape', slug: 'back_escape', domain: 'escapes', position: 'back_defense', beltLevel: 'blue', synonyms: ['Slide to Guard'], sortOrder: 35 },
	{ name: 'Knee on Belly Escape', slug: 'kob_escape', domain: 'escapes', position: 'knee_on_belly_bottom', beltLevel: 'blue', synonyms: ['Running Escape'], sortOrder: 36 },
	{ name: 'Turtle Sit-Out Escape', slug: 'turtle_sitout', domain: 'escapes', position: 'turtle', beltLevel: 'blue', synonyms: [], sortOrder: 37 },
	{ name: 'Ghost Escape', slug: 'ghost_escape', domain: 'escapes', position: 'side_control_bottom', beltLevel: 'purple', synonyms: [], sortOrder: 38 },

	// Domain 5: Submissions (12)
	{ name: 'Rear Naked Choke', slug: 'rnc', domain: 'top_control', position: 'back_control', beltLevel: 'white', synonyms: ['RNC', 'Mata Leao'], sortOrder: 39 },
	{ name: 'Armbar', slug: 'armbar', domain: 'top_control', position: 'mount', beltLevel: 'white', synonyms: ['Arm Bar', 'Juji Gatame'], sortOrder: 40 },
	{ name: 'Triangle Choke', slug: 'triangle', domain: 'guard', position: 'closed_guard', beltLevel: 'blue', synonyms: ['Triangle', 'Sankaku Jime'], sortOrder: 41 },
	{ name: 'Guillotine Choke', slug: 'guillotine', domain: 'top_control', position: 'front_headlock', beltLevel: 'blue', synonyms: ['Guillotine', 'Gilotina'], sortOrder: 42 },
	{ name: 'Kimura', slug: 'kimura', domain: 'top_control', position: 'side_control', beltLevel: 'white', synonyms: ['Double Wristlock', 'Chicken Wing'], sortOrder: 43 },
	{ name: 'Americana', slug: 'americana', domain: 'top_control', position: 'mount', beltLevel: 'white', synonyms: ['Keylock', 'Ude Garami', 'Paintbrush'], sortOrder: 44 },
	{ name: 'Cross Collar Choke', slug: 'cross_collar', domain: 'top_control', position: 'mount', beltLevel: 'white', isGiOnly: true, synonyms: [], sortOrder: 45 },
	{ name: 'Bow and Arrow Choke', slug: 'bow_arrow', domain: 'top_control', position: 'back_control', beltLevel: 'purple', isGiOnly: true, synonyms: [], sortOrder: 46 },
	{ name: "D'Arce Choke", slug: 'darce', domain: 'top_control', position: 'front_headlock', beltLevel: 'purple', synonyms: ['Darce', 'Brabo Choke'], sortOrder: 47 },
	{ name: 'Arm Triangle', slug: 'arm_triangle', domain: 'top_control', position: 'side_control', beltLevel: 'blue', synonyms: ['Head and Arm Choke', 'Kata Gatame'], sortOrder: 48 },
	{ name: 'Omoplata', slug: 'omoplata', domain: 'guard', position: 'closed_guard', beltLevel: 'blue', synonyms: [], sortOrder: 49 },
	{ name: 'Straight Ankle Lock', slug: 'ankle_lock', domain: 'guard', position: 'leg_entanglements', beltLevel: 'blue', synonyms: ['Achilles Lock', 'Footlock'], sortOrder: 50 },
];

// ─── Video Links (from homework 05, primary videos only) ───

// We'll insert these after techniques so we can reference technique slugs.
// For the seed, we store technique_id as null and match by slug post-insert.

const videosData: { slug: string; video: typeof contentLinks.$inferInsert }[] = [
	{ slug: 'upa_escape', video: { title: 'How To Do The Perfect BJJ Mount Escape', url: 'https://www.youtube.com/watch?v=EMEueexp9zU', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 15, beltLevel: 'white', isPrimary: true, notes: 'Complete mount escape system including bridge and roll.' } },
	{ slug: 'elbow_knee', video: { title: 'KNEE ELBOW ESCAPE', url: 'https://www.youtube.com/watch?v=8T2SXB-4Fd8', instructor: 'Gordon Ryan', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 10, beltLevel: 'white', isPrimary: true } },
	{ slug: 'frame_shrimp', video: { title: 'How To Do The Perfect BJJ Side Control Escape', url: 'https://www.youtube.com/watch?v=cuXq-k__9lQ', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 12, beltLevel: 'white', isPrimary: true } },
	{ slug: 'back_escape', video: { title: 'Back Escape', url: 'https://www.youtube.com/watch?v=tu3F0O5WL64', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 10, beltLevel: 'white', isPrimary: true } },
	{ slug: 'turtle_sitout', video: { title: 'How To Do The Perfect Front Headlock And Turtle Escapes', url: 'https://www.youtube.com/watch?v=JX0HL0WpYPs', instructor: 'Gordon Ryan', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 15, beltLevel: 'white', isPrimary: true } },
	{ slug: 'scissor_sweep', video: { title: '2 on 1 Grip Scissor Sweep', url: 'https://www.youtube.com/watch?v=fcZJvERQcw0', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 8, beltLevel: 'white', isPrimary: true } },
	{ slug: 'hip_bump', video: { title: 'Hip Bump Entry From Closed Guard', url: 'https://www.youtube.com/watch?v=fQDbxaK3ix8', instructor: 'Craig Jones', channel: 'B-Team / BJJ Fanatics', durationMinutes: 6, beltLevel: 'white', isPrimary: true } },
	{ slug: 'butterfly_sweep', video: { title: "Danaher's #1 Principle For Sweeping Bigger, Stronger People", url: 'https://www.youtube.com/watch?v=qiSDTWD7evk', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 10, beltLevel: 'white', isPrimary: true } },
	{ slug: 'half_guard_sweep', video: { title: 'The main sweep to know from half guard', url: 'https://www.youtube.com/watch?v=pW2YL_n8Q_U', instructor: 'Lachlan Giles', channel: 'Lachlan Giles', durationMinutes: 10, beltLevel: 'white', isPrimary: true } },
	{ slug: 'rnc', video: { title: 'How To Perform The Perfect Rear Naked Choke', url: 'https://www.youtube.com/watch?v=l8-JI7NND3E', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 12, beltLevel: 'white', isPrimary: true } },
	{ slug: 'armbar', video: { title: 'ARM BAR FROM GUARD', url: 'https://www.youtube.com/watch?v=ti69uqWKbCU', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 10, beltLevel: 'white', isPrimary: true } },
	{ slug: 'triangle', video: { title: 'How To Do The Perfect Triangle Choke Even If You Have Short Legs', url: 'https://www.youtube.com/watch?v=LDE0fkzZT6I', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 15, beltLevel: 'white', isPrimary: true } },
	{ slug: 'guillotine', video: { title: 'The High Elbow Guillotine', url: 'https://www.youtube.com/watch?v=XCiRr7TW2bk', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 10, beltLevel: 'blue', isPrimary: true } },
	{ slug: 'kimura', video: { title: 'How To Do The Perfect Kimura From Side Control', url: 'https://www.youtube.com/watch?v=p-6lmaseoGI', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 10, beltLevel: 'white', isPrimary: true } },
	{ slug: 'americana', video: { title: 'AMERICANA LOCK from MOUNT', url: 'https://www.youtube.com/watch?v=9d2FcxEfMMM', instructor: 'Andre Galvao', channel: 'Andre Galvao', durationMinutes: 6, beltLevel: 'white', isPrimary: true } },
	{ slug: 'cross_collar', video: { title: 'CROSS CHOKE', url: 'https://www.youtube.com/watch?v=n7I43wdRHwk', instructor: 'Andre Galvao', channel: 'Andre Galvao', durationMinutes: 8, beltLevel: 'white', isPrimary: true } },
	{ slug: 'arm_triangle', video: { title: '3 Most Important Jiu Jitsu Strangles (Chokes)', url: 'https://www.youtube.com/watch?v=Izvp9TAmAxs', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 15, beltLevel: 'blue', isPrimary: true } },
	{ slug: 'omoplata', video: { title: 'Omoplata', url: 'https://www.youtube.com/watch?v=rJsJcGxDGJ0', instructor: 'Firas Zahabi', channel: 'Firas Zahabi / Tristar Gym', durationMinutes: 8, beltLevel: 'blue', isPrimary: true } },
	{ slug: 'knee_cut', video: { title: 'BJJ Technique - Knee Slide Attacks', url: 'https://www.youtube.com/watch?v=K2Zd6EjGIlU', instructor: 'Firas Zahabi', channel: 'Firas Zahabi / Tristar Gym', durationMinutes: 8, beltLevel: 'blue', isPrimary: true } },
	{ slug: 'torreando', video: { title: 'GORDON RYAN - Side to Side Toreandos', url: 'https://www.youtube.com/watch?v=Hypqr5kL7BY', instructor: 'Gordon Ryan', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 8, beltLevel: 'blue', isPrimary: true } },
	{ slug: 'double_under', video: { title: 'How To Perfect Your Guard Passing No Gi', url: 'https://www.youtube.com/watch?v=isv_6Hd1Iac', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 15, beltLevel: 'blue', isPrimary: true } },
	{ slug: 'half_guard_pass', video: { title: 'GORDON RYAN Basic Half Guard Pass', url: 'https://www.youtube.com/watch?v=3N4U8cMhe9o', instructor: 'Gordon Ryan', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 8, beltLevel: 'blue', isPrimary: true } },
	{ slug: 'standing_break', video: { title: 'HOW TO OPEN CLOSED GUARD', url: 'https://www.youtube.com/watch?v=xXZo1v74gm0', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 10, beltLevel: 'white', isPrimary: true } },
	{ slug: 'double_leg', video: { title: 'Arm Drag to Low Double Leg', url: 'https://www.youtube.com/watch?v=gCOp_HE3p-Q', instructor: 'John Danaher', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 10, beltLevel: 'white', isPrimary: true } },
	{ slug: 'single_leg', video: { title: 'The Best Single Leg Takedown For Brazilian Jiu Jitsu', url: 'https://www.youtube.com/watch?v=4HBVdF5AXc0', instructor: 'Andre Galvao', channel: 'Andre Galvao', durationMinutes: 8, beltLevel: 'white', isPrimary: true } },
	{ slug: 'guard_pull', video: { title: 'Best Way to Pull Half Guard', url: 'https://www.youtube.com/watch?v=-wWcDpRoMp4', instructor: 'Bernardo Faria', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 8, beltLevel: 'white', isPrimary: true } },
	{ slug: 'snap_down', video: { title: 'Snapdown into Shuck', url: 'https://www.youtube.com/watch?v=1BOMVs_NJIk', instructor: 'Firas Zahabi', channel: 'Firas Zahabi / Tristar Gym', durationMinutes: 6, beltLevel: 'blue', isPrimary: true } },
	{ slug: 'bow_arrow', video: { title: 'Bow and Arrow Choke', url: 'https://www.youtube.com/watch?v=yrUXIujVGTM', instructor: 'Lachlan Giles', channel: 'Lachlan Giles', durationMinutes: 8, beltLevel: 'purple', isPrimary: true } },
	{ slug: 'darce', video: { title: 'Darce Choke', url: 'https://www.youtube.com/watch?v=sSVcHmYvtkA', instructor: 'Lachlan Giles', channel: 'Lachlan Giles', durationMinutes: 8, beltLevel: 'purple', isPrimary: true } },
	{ slug: 'dlr_sweep', video: { title: 'The Perfect Way To Use The De La Riva Guard No Gi Avoiding The Saddle', url: 'https://www.youtube.com/watch?v=IEJTtbstxIY', instructor: 'Lachlan Giles', channel: 'Lachlan Giles', durationMinutes: 12, beltLevel: 'purple', isPrimary: true } },
	{ slug: 'leg_drag', video: { title: "Pass ANY Guard with Gordon Ryan's 2 Step Guard Passing Rule", url: 'https://www.youtube.com/watch?v=YiQG_A7BiEE', instructor: 'Gordon Ryan', channel: 'Bernardo Faria BJJ Fanatics', durationMinutes: 12, beltLevel: 'purple', isPrimary: true } },
	{ slug: 'ankle_lock', video: { title: 'Straight ankle locks', url: 'https://www.youtube.com/watch?v=cmimzr_oNbw', instructor: 'Lachlan Giles', channel: 'Lachlan Giles', durationMinutes: 10, beltLevel: 'blue', isPrimary: true } },
];

async function seed() {
	console.log('Seeding techniques...');

	// Upsert techniques (on conflict by slug, update nothing — keep existing)
	const inserted = await db.insert(techniques).values(techniquesData)
		.onConflictDoNothing({ target: techniques.slug })
		.returning();

	console.log(`  ${inserted.length} techniques inserted (${techniquesData.length - inserted.length} already existed)`);

	// Build slug -> id map from all techniques in DB
	const allTechniques = await db.select().from(techniques);
	const slugToId = new Map(allTechniques.map(t => [t.slug, t.id]));

	console.log('Seeding video links...');

	const videoInserts = videosData
		.filter(v => slugToId.has(v.slug))
		.map(v => ({
			...v.video,
			techniqueId: slugToId.get(v.slug)!
		}));

	const insertedVideos = await db.insert(contentLinks).values(videoInserts)
		.onConflictDoNothing()
		.returning();

	console.log(`  ${insertedVideos.length} videos inserted`);

	console.log('Done!');
	await client.end();
}

seed().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});
