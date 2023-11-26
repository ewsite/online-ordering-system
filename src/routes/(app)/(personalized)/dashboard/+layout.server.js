import { database } from '$lib/database';
import order from '$lib/order';
import { error } from '@sveltejs/kit';
import user from '$lib/user';

const orderInstance = new order(database);
const userInstance = new user(database);

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, depends }) {
	let orders;
	let userData;
	depends('dashboard:reload');
	try {
		userData = await userInstance.get(String(locals?.userId));
		if (locals.role != 'admin') orders = await orderInstance.getAll(String(locals?.profileId));
		return {
			orders: orders,
			profile: userData?.profile
		};
	} catch (err) {
		throw error(400, 'Oops');
	}
}
