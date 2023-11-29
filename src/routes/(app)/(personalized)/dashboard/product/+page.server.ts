import { database } from '$lib/database'
import products, { type ProductInfo } from '$lib/products'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
const productInstance = new products(database)

export const actions: Actions = {
	add: async ({ request }) => {
		const data = Object.fromEntries(await request.formData())

		const images = data.images as File
		const info: ProductInfo = {
			name: String(data?.name),
			description: String(data?.description),
			price: Number(data?.price ?? 'Lulz'),
			images: images
		}
		try {
			await productInstance.add(info)
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			})
		}
	}
}
