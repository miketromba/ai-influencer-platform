'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useSidebar } from '@/components/ui/sidebar'

type SupabaseUser = {
	email?: string | null
	user_metadata?: Record<string, unknown> | null
}

export function SidebarUserMenu() {
	const router = useRouter()
	const { state } = useSidebar()
	const isCollapsed = state === 'collapsed'

	const [isMounted, setIsMounted] = useState(false)
	const [user, setUser] = useState<SupabaseUser | null>(null)

	useEffect(() => {
		setIsMounted(true)
		const supabase = createClient()

		let ignore = false

		const load = async () => {
			const { data } = await supabase.auth.getUser()
			if (!ignore) setUser(data.user ?? null)
		}

		load()

		const { data: sub } = supabase.auth.onAuthStateChange(() => {
			load()
		})

		return () => {
			ignore = true
			sub?.subscription.unsubscribe()
		}
	}, [])

	const displayName = useMemo(() => {
		const email = user?.email ?? ''
		const meta = (user?.user_metadata ?? {}) as {
			full_name?: string
			name?: string
		}
		return meta.full_name || meta.name || email || 'User'
	}, [user])

	const initials = useMemo(() => {
		if (!displayName) return 'U'
		const parts = displayName.split(' ')
		const first = parts[0]?.[0] ?? 'U'
		const second = parts.length > 1 ? parts[1]?.[0] ?? '' : ''
		return (first + second).toUpperCase()
	}, [displayName])

	const signOut = async () => {
		const supabase = createClient()
		await supabase.auth.signOut()
		router.push('/auth/login')
	}

	if (!isMounted) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ring-sidebar-ring flex w-full items-center gap-2 rounded-md p-2 text-left outline-hidden transition-colors focus-visible:ring-2',
						isCollapsed && 'justify-center'
					)}
				>
					<Avatar className="size-7">
						<AvatarImage alt={displayName} />
						<AvatarFallback className="text-[10px]">
							{initials}
						</AvatarFallback>
					</Avatar>
					{!isCollapsed && (
						<div className="grid min-w-0 text-left leading-tight">
							<span className="truncate text-sm font-medium">
								{displayName}
							</span>
							<span className="text-muted-foreground truncate text-xs">
								{user?.email}
							</span>
						</div>
					)}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8}>
				<DropdownMenuLabel className="max-w-[220px] truncate">
					{user?.email || 'Signed in'}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive" onClick={signOut}>
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
