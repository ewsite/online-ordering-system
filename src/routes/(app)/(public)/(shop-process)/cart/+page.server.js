import cart from '$lib/cart';
import { database } from '$lib/database';
import { fail } from '@sveltejs/kit';

const cartInstance = new cart(database);

/** @type {import('./$types').Actions} */
export const actions = {
	remove: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		try {
			await cartInstance.delete(data?.cartId, String(locals?.profileId));
		} catch (error) {
			return fail(400, { success: false, body: error });
		}

		return {
			success: true
		};
	}
};
