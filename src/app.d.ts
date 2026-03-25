import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			safeGetUser: () => Promise<{ user: import('@supabase/supabase-js').User | null }>;
		}
		// Intentionally kept loose — individual routes narrow their own data types
		// eslint-disable-next-line @typescript-eslint/no-empty-interface
		interface PageData {}
	}
}

export {};
