import { json } from '@sveltejs/kit'
import { database } from '$lib/database'
import products from '$lib/products'
import type { RequestHandler } from '@sveltejs/kit'
export const GET: RequestHandler = async () => {
	const productsInstance = new products(database)
	const data = await productsInstance.getAll()
	return json(data)
}
