import { error, json } from '@sveltejs/kit';
import { database } from '$lib/database';
import cart from '$lib/cart';
/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
	if (!locals?.loggedIn) {
		throw error(404);
	}
	const cartInstance = new cart(database);

	const cartItems = await cartInstance.getAll(String(locals?.profileId));

	return json(cartItems);
}
