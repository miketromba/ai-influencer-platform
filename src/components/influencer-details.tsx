'use client'

import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { useInfluencer } from '@/api/client/influencers'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

export function InfluencerDetails({ id }: { id: string }) {
	const { data, isLoading, isError } = useInfluencer(id)

	if (isLoading) {
		return (
			<div className="w-full">
				<div className="mb-4">
					<Skeleton className="h-8 w-56" />
				</div>
				<div className="flex gap-6 items-start">
					<Skeleton className="h-40 w-40 rounded-lg" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-80" />
						<Skeleton className="h-4 w-72" />
					</div>
				</div>
			</div>
		)
	}

	if (isError || !data) {
		return (
			<div className="w-full text-sm text-muted-foreground">
				Failed to load influencer
			</div>
		)
	}

	return (
		<div className="w-full">
			<h1 className="text-3xl md:text-4xl font-bold mb-4">{data.name}</h1>
			<div className="flex flex-col gap-6">
				{data.main_image ? (
					<div className="relative h-80 w-full md:h-[420px] overflow-hidden rounded-lg">
						<Image
							src={data.main_image}
							alt={data.name}
							fill
							className="object-cover"
						/>
					</div>
				) : null}
				<div className="flex-1">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-base font-medium">Description</h2>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Edit description"
						>
							<Pencil className="size-4" />
						</Button>
					</div>
					<div className="rounded-lg border p-4">
						<p className="text-sm text-muted-foreground whitespace-pre-wrap">
							{data.description}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
