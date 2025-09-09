import { Hono } from 'hono'
import { db, schema } from '@/db'
import { getAuthUser } from '@/api/auth'
import { and, desc, eq, lt } from 'drizzle-orm'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { randomUUID } from 'crypto'
import { generateImage } from '@/lib/generateImage'
import { createServiceClient } from '@/lib/supabase/admin'
import {
	DEFAULT_PAGE_SIZE,
	clampPageSize,
	decodePaginationToken,
	encodePaginationToken,
	type PaginatedResponse
} from '@/lib/pagination'

const listQuerySchema = z.object({
	pageSize: z.string().optional(),
	nextToken: z.string().optional()
})

const createFormSchema = z.object({
	name: z.string().min(2).max(100),
	description: z.string().min(10).max(1000)
})

export const influencersRouter = new Hono()
	// GET /influencers?pageSize&nextToken
	.get('/', zValidator('query', listQuerySchema), async c => {
		const user = await getAuthUser(c)
		const { pageSize: pageSizeParam, nextToken } = c.req.valid('query')
		const limit = clampPageSize(
			pageSizeParam ? parseInt(pageSizeParam, 10) : DEFAULT_PAGE_SIZE
		)
		const cursor = decodePaginationToken(nextToken)

		const baseWhere = and(eq(schema.influencers.user_id, user.id))
		const whereClause = cursor
			? and(
					baseWhere,
					lt(
						schema.influencers.created_at,
						new Date(cursor.lastCreatedAt)
					)
			  )
			: baseWhere

		const rows = await db
			.select({
				id: schema.influencers.id,
				name: schema.influencers.name,
				created_at: schema.influencers.created_at
			})
			.from(schema.influencers)
			.where(whereClause)
			.orderBy(
				desc(schema.influencers.created_at),
				desc(schema.influencers.id)
			)
			.limit(limit + 1)

		const hasMore = rows.length > limit
		const items = rows.slice(0, limit).map(r => ({
			id: r.id,
			name: r.name,
			created_at: r.created_at ? r.created_at.toISOString() : null
		}))

		const nextPageToken =
			hasMore && items.length
				? encodePaginationToken({
						lastId: items[items.length - 1].id,
						lastCreatedAt:
							items[items.length - 1].created_at ??
							new Date(0).toISOString()
				  })
				: null

		return c.json<PaginatedResponse<(typeof items)[number]>>({
			items,
			nextToken: nextPageToken,
			hasMore
		})
	})

	// POST /influencers - create influencer from formdata
	.post('/', async c => {
		const user = await getAuthUser(c)
		if (!process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET) {
			return c.json(
				{ ok: false, error: 'Storage bucket not configured' },
				500
			)
		}

		const form = await c.req.formData()
		const name = form.get('name') as string
		const description = form.get('description') as string
		const image = form.get('image')

		const parsed = createFormSchema.safeParse({ name, description })
		if (!parsed.success) {
			return c.json(
				{
					ok: false,
					error: parsed.error.issues.map(i => i.message).join(', ')
				},
				400
			)
		}

		let imageBuffer: Buffer
		let imageMimeType: string
		if (image instanceof File) {
			imageBuffer = Buffer.from(await image.arrayBuffer())
			imageMimeType = image.type || 'image/png'
		} else {
			const generated = await generateImage(
				`${description}. Stylized, portrait, high quality.`
			)
			imageBuffer = generated.buffer
			imageMimeType = generated.mimeType
		}

		const ext = imageMimeType.includes('png')
			? 'png'
			: imageMimeType.includes('webp')
			? 'webp'
			: 'jpg'

		const influencerId = randomUUID()
		const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET!
		const path = `users/${user.id}/influencers/${influencerId}/main.${ext}`

		const svc = createServiceClient()
		const uploadRes = await svc.storage
			.from(STORAGE_BUCKET)
			.upload(path, imageBuffer, {
				contentType: imageMimeType,
				upsert: true
			})
		if (uploadRes.error) {
			return c.json({ ok: false, error: uploadRes.error.message }, 400)
		}
		const { data: publicUrlData } = svc.storage
			.from(STORAGE_BUCKET)
			.getPublicUrl(path)
		const mainImageUrl = publicUrlData.publicUrl

		await db.insert(schema.influencers).values({
			id: influencerId,
			user_id: user.id,
			name,
			description,
			main_image: mainImageUrl
		})

		return c.json<{ ok: true; id: string }>(
			{ ok: true, id: influencerId },
			201
		)
	})
