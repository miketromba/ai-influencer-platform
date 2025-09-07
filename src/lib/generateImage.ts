import { GoogleGenAI } from '@google/genai'

// Server-side only util for generating an image from a text description
// Requires env var: GEMINI_API_KEY

const MODEL_ID = 'gemini-2.5-flash-image-preview'

export type GeneratedImage = {
	buffer: Buffer
	mimeType: string
}

export type InputImage = {
	data: Buffer | Uint8Array | string
	mimeType: string
}

function toBase64(data: Buffer | Uint8Array | string): string {
	if (typeof data === 'string') return data
	return Buffer.from(data).toString('base64')
}

function ensureApiKey() {
	if (!process.env.GEMINI_API_KEY) {
		throw new Error('GEMINI_API_KEY is not set')
	}
}

function extractFirstInlineImage(response: any): GeneratedImage {
	for (const part of response?.candidates?.[0]?.content?.parts ?? []) {
		if (part?.inlineData) {
			const inline = part.inlineData as {
				data: string
				mimeType?: string
			}
			const buffer = Buffer.from(inline.data, 'base64')
			return { buffer, mimeType: inline.mimeType ?? 'image/png' }
		}
	}
	throw new Error('No image returned by Gemini')
}

export async function generateImage(
	prompt: string,
	options?: { images?: InputImage | InputImage[]; model?: string }
): Promise<GeneratedImage> {
	ensureApiKey()
	const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
	const model = options?.model ?? MODEL_ID

	const providedImages = options?.images
	let contents: any
	if (providedImages && Array.isArray(providedImages)) {
		contents = [
			{ text: prompt },
			...providedImages.map(img => ({
				inlineData: { mimeType: img.mimeType, data: toBase64(img.data) }
			}))
		]
	} else if (providedImages) {
		const img = providedImages as InputImage
		contents = [
			{ text: prompt },
			{ inlineData: { mimeType: img.mimeType, data: toBase64(img.data) } }
		]
	} else {
		contents = prompt
	}

	const response = await ai.models.generateContent({ model, contents })
	return extractFirstInlineImage(response as any)
}
