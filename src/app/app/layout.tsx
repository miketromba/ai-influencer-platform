import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarInset,
	SidebarProvider,
	SidebarRail
} from '@/components/ui/sidebar'
import { SidebarInfluencerList } from '@/components/sidebar-influencer-list'

export default function ProtectedLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Influencers</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarInfluencerList />
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<div className="flex-1 p-6">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
