type PageProps = {
	params: { id: string }
}

export default function InfluencerPage({ params }: PageProps) {
	const { id } = params
	return (
		<div className="flex-1">
			<div className="text-sm text-muted-foreground">Influencer ID</div>
			<h1 className="mt-1 text-2xl font-semibold">{id}</h1>
		</div>
	)
}
