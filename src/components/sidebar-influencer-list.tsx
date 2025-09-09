'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'

import { useInfluencersList } from '@/api/client/influencers'

export function SidebarInfluencerList() {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useInfluencersList({ pageSize: 20 })

	const sentinelRef = useRef<HTMLDivElement | null>(null)
	useEffect(() => {
		if (!sentinelRef.current) return
		const el = sentinelRef.current
		const io = new IntersectionObserver(entries => {
			const first = entries[0]
			if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
				fetchNextPage()
			}
		})
		io.observe(el)
		return () => io.disconnect()
	}, [fetchNextPage, hasNextPage, isFetchingNextPage])

	const items = data?.pages.flatMap(p => p.items) ?? []

	return (
		<SidebarMenu>
			{items.map(influencer => (
				<SidebarMenuItem key={influencer.id}>
					<SidebarMenuButton asChild size="lg" className="gap-3 px-3">
						<Link href={`/app/influencers/${influencer.id}`}>
							<Avatar className="size-9 shrink-0">
								<AvatarFallback className="text-xs">
									{influencer.name
										.split(' ')
										.map(part => part[0])
										.join('')
										.slice(0, 2)
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<span className="truncate">{influencer.name}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
			<div ref={sentinelRef} />
		</SidebarMenu>
	)
}
