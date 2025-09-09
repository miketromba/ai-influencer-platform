'use client'

import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'
import { apiClient } from '@/api/client'
import { useRouter } from 'next/navigation'
import { DEFAULT_PAGE_SIZE } from '@/lib/pagination'

export function useInfluencersList({
	pageSize = DEFAULT_PAGE_SIZE
}: { pageSize?: number } = {}) {
	return useInfiniteQuery({
		queryKey: ['influencers', { pageSize }],
		queryFn: async ({ pageParam }) => {
			const res = await apiClient.api.influencers.$get({
				query: {
					pageSize: String(pageSize),
					nextToken: pageParam ?? undefined
				}
			})
			if (!res.ok) throw new Error('Failed to load influencers')
			return await res.json()
		},
		initialPageParam: null as string | null,
		getNextPageParam: lastPage => lastPage.nextToken
	})
}

export function useCreateInfluencer() {
	const qc = useQueryClient()
	const router = useRouter()
	return useMutation({
		mutationFn: async (form: FormData) => {
			const res = await apiClient.api.influencers.$post({ form })
			if (!res.ok) {
				const json = await res.json()
				throw new Error(
					(json as any).error || 'Failed to create influencer'
				)
			}
			return await res.json()
		},
		onSuccess: async data => {
			await qc.invalidateQueries({ queryKey: ['influencers'] })
			if (data.ok) router.push(`/app/influencers/${data.id}`)
		}
	})
}

export function useInfluencer(id: string | undefined) {
	return useQuery({
		queryKey: ['influencer', id],
		queryFn: async () => {
			if (!id) throw new Error('Missing id')
			const res = await apiClient.api.influencers[':id'].$get({
				param: { id }
			})
			if (!res.ok) throw new Error('Failed to load influencer')
			return await res.json()
		},
		enabled: !!id
	})
}
