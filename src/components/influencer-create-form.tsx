'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Upload, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateInfluencer } from '@/api/client/influencers'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Name must be at least 2 characters.' })
		.max(100, { message: 'Name must be at most 100 characters.' }),
	description: z
		.string()
		.min(10, { message: 'Description must be at least 10 characters.' })
		.max(1000, { message: 'Description must be at most 1000 characters.' }),
	image: z.instanceof(File).optional().or(z.undefined()),
	imageMode: z.enum(['generate', 'upload'])
})

type InfluencerFormValues = z.infer<typeof formSchema>

export function InfluencerCreateForm() {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState<string | null>(null)
	const router = require('next/navigation').useRouter()
	const { mutateAsync } = useCreateInfluencer()
	const form = useForm<InfluencerFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
			imageMode: 'generate'
		}
	})

	async function onSubmit(values: InfluencerFormValues) {
		setSubmitError(null)
		setIsSubmitting(true)
		try {
			const formData = new FormData()
			formData.append('name', values.name)
			formData.append('description', values.description)
			if (values.image) formData.append('image', values.image)
			const res = await mutateAsync(formData)
			if (res.ok && res.id) {
				form.reset({
					name: '',
					description: '',
					image: undefined,
					imageMode: 'generate'
				})
				setPreviewUrl(null)
				router.push(`/app/influencers/${res.id}`)
				return
			}
			setSubmitError('Something went wrong.')
		} catch (err: any) {
			setSubmitError(err?.message || 'Unexpected error occurred.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="w-full max-w-xl mx-auto px-4">
			<div className="space-y-6">
				<div className="space-y-1">
					<h2 className="text-2xl font-semibold">
						Create an influencer
					</h2>
					<p className="text-sm text-muted-foreground">
						Give them a name and description. You can upload an
						image or let us generate one for you.
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-6"
					>
						{submitError ? (
							<div className="text-sm text-destructive">
								{submitError}
							</div>
						) : null}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											className="h-12 text-base"
											placeholder="e.g. Nova Star"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											disabled={isSubmitting}
											placeholder="Describe their personality, style, and vibe."
											className="min-h-32 text-base py-3"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="imageMode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Influencer image</FormLabel>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div
											role="button"
											tabIndex={0}
											onClick={() => {
												field.onChange('generate')
												form.setValue(
													'image',
													undefined
												)
												setPreviewUrl(null)
											}}
											onKeyDown={e => {
												if (
													e.key === 'Enter' ||
													e.key === ' '
												) {
													e.preventDefault()
													field.onChange('generate')
													form.setValue(
														'image',
														undefined
													)
													setPreviewUrl(null)
												}
											}}
											className={cn(
												'cursor-pointer rounded-lg border-2 p-4 transition-shadow hover:shadow-md hover:bg-muted/50',
												field.value === 'generate' &&
													'ring-2 ring-primary border-primary bg-accent/30'
											)}
										>
											<div className="flex items-center gap-2 font-medium mb-1">
												{field.value === 'generate' && (
													<Check className="size-4" />
												)}
												<span>
													Generate from description
												</span>
											</div>
											<p className="text-sm text-muted-foreground">
												We’ll create an initial image
												based on your description.
											</p>
										</div>
										<div
											role="button"
											tabIndex={0}
											onClick={() => {
												field.onChange('upload')
												if (!previewUrl)
													fileInputRef.current?.click()
											}}
											onKeyDown={e => {
												if (
													e.key === 'Enter' ||
													e.key === ' '
												) {
													e.preventDefault()
													field.onChange('upload')
													if (!previewUrl)
														fileInputRef.current?.click()
												}
											}}
											className={cn(
												'cursor-pointer rounded-lg border-2 p-4 transition-shadow hover:shadow-md hover:bg-muted/50 relative',
												field.value === 'upload' &&
													'ring-2 ring-primary border-primary bg-accent/30'
											)}
										>
											<input
												ref={fileInputRef}
												type="file"
												accept="image/*"
												className="hidden"
												onChange={e => {
													const file =
														e.target.files?.[0]
													if (file) {
														form.setValue(
															'image',
															file
														)
														form.setValue(
															'imageMode',
															'upload'
														)
														setPreviewUrl(
															URL.createObjectURL(
																file
															)
														)
													}
												}}
											/>
											<div className="flex items-center gap-2 font-medium mb-1">
												{field.value === 'upload' && (
													<Check className="size-4" />
												)}
												<span>Upload an image</span>
											</div>
											{previewUrl ? (
												<div className="mt-2 relative">
													<img
														src={previewUrl}
														alt="Preview"
														className="h-16 w-16 rounded object-cover border"
													/>
												</div>
											) : (
												<p className="text-sm text-muted-foreground">
													Click to choose a photo from
													your device.
												</p>
											)}
										</div>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end">
							<Button
								disabled={isSubmitting}
								type="submit"
								className="h-12 text-base"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Creating...
									</>
								) : (
									'Create influencer'
								)}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}

export default InfluencerCreateForm
