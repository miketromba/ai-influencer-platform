import { AuthButton } from '@/components/auth-button'
import Link from 'next/link'

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col">
			<nav className="w-full border-b h-16 flex items-center justify-between px-5 text-sm">
				<Link href="/">AI Influencer Platform</Link>
				<AuthButton />
			</nav>
			<div className="flex-1 flex items-center justify-center p-6">
				<div className="text-center">
					<h1 className="text-2xl font-semibold mb-4">Welcome</h1>
					<p className="text-muted-foreground">
						Sign in or sign up to continue.
					</p>
				</div>
			</div>
		</main>
	)
}
