-- Add userId to messages table for defense-in-depth isolation
ALTER TABLE "messages" ADD COLUMN "user_id" uuid REFERENCES "users"("id") ON DELETE CASCADE;
CREATE INDEX "messages_user_idx" ON "messages" ("user_id");

-- Stripe webhook idempotency table
CREATE TABLE IF NOT EXISTS "stripe_processed_events" (
	"id" text PRIMARY KEY NOT NULL,
	"processed_at" timestamp DEFAULT now() NOT NULL
);
