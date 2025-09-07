'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'

const createInfluencerSchema = z.object({
	name: z.string().min(2).max(100),
	description: z.string().min(10).max(1000),
	// When image is not provided, we will generate one later in a job
	image: z.instanceof(File).optional().or(z.undefined())
})

export async function createInfluencerAction(formData: FormData) {
	const name = formData.get('name')
	const description = formData.get('description')
	const image = formData.get('image')

	const parsed = createInfluencerSchema.safeParse({
		name,
		description,
		image: image instanceof File ? image : undefined
	})
	if (!parsed.success) {
		return { ok: false, error: parsed.error.flatten() }
	}

	const supabase = await createClient()
	const { data: claims } = await supabase.auth.getClaims()
	if (!claims?.claims?.sub) {
		return { ok: false, error: 'Not authenticated' }
	}

	// Placeholder: persist later with Drizzle. For now, no-op and revalidate.
	revalidatePath('/app')
	return { ok: true }
}
