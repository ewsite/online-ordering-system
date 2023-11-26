import { database } from '$lib/database';
import products from '$lib/products';
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const productsInstance = new products(database);

	const data = await productsInstance.get(params?.product);

	if (!data?.id) {
		throw error(404, {
			message: 'Product not found.'
		});
	}
	// This is a dummy list of products. Don't do this in production.
	return json(data);
}
