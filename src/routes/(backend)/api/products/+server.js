import { json } from '@sveltejs/kit';
import { database } from '$lib/database';
import products from '$lib/products';
/** @type {import('./$types').RequestHandler} */
export async function GET() {
	const productsInstance = new products(database);

	const data = await productsInstance.getAll();
	return json(data);
}
