import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { InfluencerCreateForm } from '@/components/influencer-create-form'

export default async function ProtectedPage() {
	const supabase = await createClient()

	const { data, error } = await supabase.auth.getClaims()
	if (error || !data?.claims) {
		redirect('/auth/login')
	}

	return (
		<div className="flex-1 w-full flex items-center justify-center min-h-full">
			<InfluencerCreateForm />
		</div>
	)
}
