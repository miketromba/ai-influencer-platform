import type { ComponentType } from 'react'
type PageProps = {
	params: Promise<{ id: string }>
}

export default async function InfluencerPage({ params }: PageProps) {
	const { id } = await params
	return (
		<div className="flex-1 grid grid-cols-1 md:grid-cols-[2fr_1px_3fr] gap-6 md:gap-0">
			<div className="md:pr-6">
				<ClientDetails id={id} />
			</div>
			<div className="hidden md:block h-full w-px bg-border" />
			<div className="md:pl-6">
				{/* Right pane - left empty for now */}
			</div>
		</div>
	)
}

function ClientDetails({ id }: { id: string }) {
	const InfluencerDetails = require('@/components/influencer-details')
		.InfluencerDetails as ComponentType<{ id: string }>
	return <InfluencerDetails id={id} />
}
