import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
	SidebarRail
} from '@/components/ui/sidebar'
import { SidebarInfluencerList } from '@/components/sidebar-influencer-list'
import { SidebarUserMenu } from '@/components/sidebar-user-menu'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import logo from '@/assets/logo.png'

export default function ProtectedLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader className="gap-2 pb-2">
					<Link href="/app" className="flex items-center p-2">
						<Image
							src={logo}
							alt="infloo.ai"
							className="h-8 w-auto"
							priority
						/>
					</Link>
					<Button
						asChild
						variant="outline"
						className="w-full justify-start group-data-[collapsible=icon]:hidden"
					>
						<Link href="/app">
							<UserPlus className="size-4" />
							New influencer
						</Link>
					</Button>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup className="pt-1">
						<SidebarGroupLabel>Influencers</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarInfluencerList />
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarUserMenu />
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<div className="flex-1 p-6 overflow-y-auto flex">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
