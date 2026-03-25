import { pgTable, pgEnum, text, integer, timestamp, real, boolean, jsonb, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const beltEnum = pgEnum('belt', ['white', 'blue', 'purple', 'brown', 'black']);
export const domainEnum = pgEnum('domain', ['guard', 'passing', 'top_control', 'escapes', 'takedowns']);
export const eventTypeEnum = pgEnum('event_type', ['attempt', 'success', 'against']);
export const sessionTypeEnum = pgEnum('session_type', ['rolling', 'drilling', 'open_mat', 'competition', 'private_lesson']);
export const moodEnum = pgEnum('mood', ['confident', 'focused', 'frustrated', 'anxious', 'flow_state']);
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant', 'system']);
export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'paid']);

// Users
export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	authId: text('auth_id').notNull().unique(),
	email: text('email').notNull().unique(),
	name: text('name'),
	belt: beltEnum('belt').notNull().default('white'),
	experienceYears: real('experience_years').notNull().default(0),
	trainingGoalDays: integer('training_goal_days').notNull().default(3),
	goals: jsonb('goals').$type<string[]>().default([]),
	struggles: jsonb('struggles').$type<string[]>().default([]),
	subscriptionTier: subscriptionTierEnum('subscription_tier').notNull().default('free'),
	onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Training sessions
export const sessions = pgTable('sessions', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	date: timestamp('date').notNull(),
	type: sessionTypeEnum('type').notNull(),
	durationMinutes: integer('duration_minutes').notNull(),
	intensityRpe: integer('intensity_rpe').notNull(),
	energy: integer('energy').notNull(),
	mood: moodEnum('mood'),
	notes: text('notes'),
	positionsWorked: jsonb('positions_worked').$type<string[]>().default([]),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
	index('sessions_user_date_idx').on(table.userId, table.date)
]);

// Technique events (submissions hit, received, etc.)
export const events = pgTable('events', {
	id: uuid('id').primaryKey().defaultRandom(),
	sessionId: uuid('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	techniqueId: uuid('technique_id').notNull().references(() => techniques.id),
	type: eventTypeEnum('type').notNull(),
	count: integer('count').notNull().default(1),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
	index('events_user_technique_idx').on(table.userId, table.techniqueId)
]);

// Technique taxonomy
export const techniques = pgTable('techniques', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	domain: domainEnum('domain').notNull(),
	position: text('position').notNull(),
	beltLevel: beltEnum('belt_level').notNull().default('white'),
	isGiOnly: boolean('is_gi_only').notNull().default(false),
	synonyms: jsonb('synonyms').$type<string[]>().default([]),
	sortOrder: integer('sort_order').notNull().default(0)
});

// Conversations (chat threads)
export const conversations = pgTable('conversations', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => [
	index('conversations_user_idx').on(table.userId)
]);

// Chat messages
export const messages = pgTable('messages', {
	id: uuid('id').primaryKey().defaultRandom(),
	conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
	role: messageRoleEnum('role').notNull(),
	content: text('content').notNull(),
	metadata: jsonb('metadata'),
	createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => [
	index('messages_conversation_idx').on(table.conversationId)
]);

// Approved video content
export const contentLinks = pgTable('content_links', {
	id: uuid('id').primaryKey().defaultRandom(),
	techniqueId: uuid('technique_id').references(() => techniques.id),
	title: text('title').notNull(),
	url: text('url').notNull(),
	instructor: text('instructor').notNull(),
	channel: text('channel'),
	durationMinutes: integer('duration_minutes'),
	beltLevel: beltEnum('belt_level').notNull().default('white'),
	isPrimary: boolean('is_primary').notNull().default(true),
	notes: text('notes')
});

// Message rate limiting
export const messageCounts = pgTable('message_counts', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	weekStart: timestamp('week_start').notNull(),
	count: integer('count').notNull().default(0)
}, (table) => [
	index('message_counts_user_week_idx').on(table.userId, table.weekStart)
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	conversations: many(conversations),
	events: many(events),
	messageCounts: many(messageCounts)
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] }),
	events: many(events)
}));

export const eventsRelations = relations(events, ({ one }) => ({
	session: one(sessions, { fields: [events.sessionId], references: [sessions.id] }),
	user: one(users, { fields: [events.userId], references: [users.id] }),
	technique: one(techniques, { fields: [events.techniqueId], references: [techniques.id] })
}));

export const techniquesRelations = relations(techniques, ({ many }) => ({
	events: many(events),
	contentLinks: many(contentLinks)
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
	user: one(users, { fields: [conversations.userId], references: [users.id] }),
	messages: many(messages)
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] })
}));

export const contentLinksRelations = relations(contentLinks, ({ one }) => ({
	technique: one(techniques, { fields: [contentLinks.techniqueId], references: [techniques.id] })
}));

export const messageCountsRelations = relations(messageCounts, ({ one }) => ({
	user: one(users, { fields: [messageCounts.userId], references: [users.id] })
}));
