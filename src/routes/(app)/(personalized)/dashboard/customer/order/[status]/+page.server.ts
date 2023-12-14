import order, { type SetOrderArgs } from '$lib/order'
import { database } from '$lib/database'
import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types.js'
import type { $Enums } from '@prisma/client'

const orderInstance = new order(database)

export const load: PageServerLoad = async ({ params, depends }) => {
	depends('orders:reload')
	const orderStatus = params.status.toUpperCase() as $Enums.OrderStatus
	try {
		return { orders: await orderInstance.getAllFromTheUsers(orderStatus) }
	} catch (err) {
		throw error(400, 'Oops')
	}
}
export const actions: Actions = {
	setOrderStatus: async ({ request }) => {
		const data = Object.fromEntries(await request.formData())

		const filteredData: SetOrderArgs = {
			orderId: Number(data?.orderId ?? -1),
			profileId: String(data?.profileId),
			status: String(data?.orderStatus) as $Enums.OrderStatus
		}

		try {
			await orderInstance.setOrderStatus(filteredData)
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			})
		}

		return {
			success: true,
			body: 'Lovely!'
		}
	}
}
