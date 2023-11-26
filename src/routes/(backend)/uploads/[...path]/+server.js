/** @type {import('./$types').RequestHandler} */
import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
export async function GET({ params, url }) {
	const uploadPath = 'uploads/';

	const filename = url.searchParams.has('size')
		? `/sample1-${url.searchParams.get('size')}.webp`
		: '/sample1.webp';
	try {
		const awak = await readFile(`${uploadPath}${params.path}${filename}`);
		return new Response(awak, {
			headers: {
				'Content-Type': 'image/webp',
				'Content-Length': String(Buffer.byteLength(awak))
			}
		});
	} catch (err) {
		// @ts-ignore
		switch (String(err?.code)) {
			case 'ENOENT':
				throw error(404);
			default:
				throw error(500);
		}
	}
}
