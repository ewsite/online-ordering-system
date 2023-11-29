import { database } from '$lib/database'
import order from '$lib/order'
import { error } from '@sveltejs/kit'
import user from '$lib/user'
import type { LayoutServerLoad } from './$types'

const orderInstance = new order(database)
const userInstance = new user(database)

export const load: LayoutServerLoad = async ({ depends, locals }) => {
	depends('dashboard:reload')
	try {
		let orders
		const userData = await userInstance.get(locals?.userId)
		if (locals.role != 'admin') orders = await orderInstance.getAll(locals?.profileId)
		return {
			orders: orders,
			profile: userData?.profile
		}
	} catch (err) {
		throw error(400, 'Oops')
	}
}
