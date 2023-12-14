import cart, { type CartArgs } from '$lib/cart'
import { database } from '$lib/database'
import { fail, type Actions } from '@sveltejs/kit'

const cartInstance = new cart(database)

export const actions: Actions = {
	remove: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData())

		const args: CartArgs = {
			cartId: Number(data?.cartId),
			profileId: locals?.profileId
		}

		try {
			await cartInstance.delete(args)
		} catch (error) {
			return fail(400, { success: false, body: error })
		}

		return { success: true }
	}
}
