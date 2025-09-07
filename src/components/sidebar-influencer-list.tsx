import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'

type Influencer = {
	id: string
	name: string
}

const placeholderInfluencers: Influencer[] = [
	{ id: '1', name: 'Alice Johnson' },
	{ id: '2', name: 'Brian Chen' },
	{ id: '3', name: 'Carmen Díaz' },
	{ id: '4', name: 'Diego Rossi' },
	{ id: '5', name: 'Eva Müller' }
]

export function SidebarInfluencerList() {
	return (
		<SidebarMenu>
			{placeholderInfluencers.map(influencer => (
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
		</SidebarMenu>
	)
}
