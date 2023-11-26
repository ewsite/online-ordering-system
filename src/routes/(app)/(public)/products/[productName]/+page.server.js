import { error, fail } from '@sveltejs/kit';
import { database } from '$lib/database';
import cart from '$lib/cart';
import products from '$lib/products';

const cartInstance = new cart(database);
const productInstance = new products(database);
/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	let product;
	let cartInfo;

	try {
		product = await productInstance.get(params?.productName);

		if (locals?.loggedIn) {
			cartInfo = await cartInstance.getUsingProductId(product?.id, String(locals.profileId));
		}
	} catch (err) {
		throw error(404);
	}

	if (!product?.id) {
		throw error(404);
	}

	return {
		cart: cartInfo,
		product: product
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	addToCart: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		if (!locals?.loggedIn) return fail(401, { message: 'You must log in to sync your progress.' });

		const productId = data?.productId ?? -1;
		const quantity = data?.quantity ?? 1;
		try {
			await cartInstance.add({
				productId: Number(productId),
				profileId: String(locals?.profileId),
				quantity: Number(quantity)
			});
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			});
		}

		return {
			message: 'Very nice'
		};
	},
	editTocart: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		if (!locals?.loggedIn) return fail(401, { message: 'You must log in to sync your progress.' });

		const cartId = data?.cartId ?? -1;
		const cartDataToChange = {
			// Fix this shit
			quantity: Number(data?.quantity)
		};
		try {
			await cartInstance.edit(Number(cartId), String(locals?.profileId), cartDataToChange);
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			});
		}

		return {
			message: 'Very nice'
		};
	}
};
