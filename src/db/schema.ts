// db/schema.ts
import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core'

// Influencers table
export const influencers = pgTable('influencers', {
	id: uuid('id').primaryKey(),
	user_id: uuid('user_id').references(() => profiles.id),
	name: text('name').notNull(),
	description: text('description').notNull(),
	main_image: text('main_image').notNull(),
	created_at: timestamp('created_at', {
		mode: 'date',
		withTimezone: true
	})
		.defaultNow()
		.notNull()
})

// Assets table (images, videos, audio, etc. files that we generate)
export const assets = pgTable('assets', {
	id: uuid('id').primaryKey(),
	user_id: uuid('user_id').references(() => profiles.id),
	influencer_id: uuid('influencer_id').references(() => influencers.id),
	asset_type: text('asset_type', {
		enum: ['image', 'video', 'audio']
	}).notNull(),
	asset_url: text('asset_url').notNull(),
	created_at: timestamp('created_at', {
		mode: 'date',
		withTimezone: true
	})
		.defaultNow()
		.notNull()
})

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
