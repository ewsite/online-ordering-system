import order from '$lib/order';
import { database } from '$lib/database';
import { error, fail } from '@sveltejs/kit';

const orderInstance = new order(database);
/** @type {import('./$types').PageServerLoad} */
export async function load({ depends, params }) {
	depends('orders:reload');
	try {
		return {
			orders: await orderInstance.getAllFromTheUsers(params.status.toUpperCase()),
			selectedStatus: params.status
		};
	} catch (err) {
		throw error(400, 'Oops');
	}
}
/** @type {import('./$types').Actions} */
export const actions = {
	setOrderStatus: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		try {
			await orderInstance.setOrderStatus(
				data?.orderId,
				data?.profileId,
				// @ts-ignore
				data?.orderStatus
			);
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			});
		}

		return {
			success: true,
			body: 'Lovely!'
		};
	}
};
