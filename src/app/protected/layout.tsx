import { AuthButton } from '@/components/auth-button'
import Link from 'next/link'

export default function ProtectedLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<main className="min-h-screen flex flex-col">
			<nav className="w-full border-b h-16 flex items-center justify-between px-5 text-sm">
				<Link href="/">AI Influencer Platform</Link>
				<AuthButton />
			</nav>
			<div className="flex-1 flex flex-col p-5 max-w-5xl w-full mx-auto">
				{children}
			</div>
		</main>
	)
}
