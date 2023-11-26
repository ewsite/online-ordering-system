import { database } from '$lib/database';
import products from '$lib/products';
import { fail } from '@sveltejs/kit';
const productInstance = new products(database);

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			await productInstance.add({
				name: data?.name,
				description: data?.description,
				price: data?.price,
				images: data?.images
			});
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			});
		}
	}
};
