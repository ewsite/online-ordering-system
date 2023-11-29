import { error, json } from '@sveltejs/kit'
import { database } from '$lib/database'
import cart from '$lib/cart'
import type { RequestHandler } from '@sveltejs/kit'

const cartInstance = new cart(database)

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals?.loggedIn) {
		throw error(404)
	}

	const cartItems = await cartInstance.getAll(String(locals?.profileId))

	return json(cartItems)
}
