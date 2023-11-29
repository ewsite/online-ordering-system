import { error } from '@sveltejs/kit'
import { readFile } from 'fs/promises'
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	const uploadPath = 'uploads/'

	const filename = url.searchParams.has('size')
		? `/sample1-${url.searchParams.get('size')}.webp`
		: '/sample1.webp'
	try {
		const awak = await readFile(`${uploadPath}${params.path}${filename}`)
		return new Response(awak, {
			headers: {
				'Content-Type': 'image/webp',
				'Content-Length': String(Buffer.byteLength(awak))
			}
		})
	} catch (err) {
		// @ts-expect-error Plase help me
		switch (String(err?.code)) {
			case 'ENOENT':
				throw error(404)
			default:
				throw error(500)
		}
	}
}
