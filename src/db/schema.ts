// db/schema.ts
import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core'

// User profiles table linked to auth.users
export const profiles = pgTable(
	'profiles',
	{
		id: uuid('id').primaryKey(), // References auth.users, handled via trigger
		email: text('email'),
		email_confirmed_at: timestamp('email_confirmed_at', {
			mode: 'date',
			withTimezone: true
		}),
		last_sign_in_at: timestamp('last_sign_in_at', {
			mode: 'date',
			withTimezone: true
		}),
		created_at: timestamp('created_at', {
			mode: 'date',
			withTimezone: true
		})
			.defaultNow()
			.notNull(),
		updated_at: timestamp('updated_at', {
			mode: 'date',
			withTimezone: true
		})
			.defaultNow()
			.notNull(),
		changelog_last_viewed: timestamp('changelog_last_viewed', {
			mode: 'date'
		})
			.defaultNow()
			.notNull()
	},
	table => [
		index('profiles_id_idx').on(table.id),
		index('profiles_email_idx').on(table.email)
	]
)
