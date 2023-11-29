import { error, fail } from '@sveltejs/kit'
import { database } from '$lib/database'
import cart, { type CartArgs, type CartInfo } from '$lib/cart'
import products from '$lib/products'
import type { PageServerLoad, Actions } from './$types'

const cartInstance = new cart(database)
const productInstance = new products(database)

export const load: PageServerLoad = async ({ params, locals }) => {
	let product
	let cartInfo

	try {
		product = await productInstance.get(params?.productName)

		if (locals.loggedIn) {
			cartInfo = await cartInstance.getUsingProductId(
				locals.profileId,
				Number(product?.id ?? -1)
			)
		}

		if (!product?.id) {
			throw error(404)
		}

		return {
			cart: cartInfo,
			product: product
		}
	} catch (err) {
		throw error(404)
	}
}

export const actions: Actions = {
	addToCart: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData())

		const info: CartInfo = {
			productId: Number(data?.productId ?? -1),
			profileId: locals.profileId,
			quantity: Number(data?.quantity ?? 1)
		}

		try {
			await cartInstance.add(info)
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			})
		}

		return { success: true }
	},
	editTocart: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData())

		if (!locals?.loggedIn)
			return fail(401, { message: 'You must log in to sync your progress.' })

		const quantity: CartInfo['quantity'] = Number(data?.quantity ?? 'sasas')
		const args: CartArgs = {
			cartId: Number(data?.cartId ?? -1),
			profileId: locals?.profileId
		}

		try {
			await cartInstance.edit(args, quantity)
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			})
		}

		return { success: true }
	}
}
