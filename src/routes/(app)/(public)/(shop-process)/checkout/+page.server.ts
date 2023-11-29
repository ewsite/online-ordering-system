import address from '$lib/address'
import { database } from '$lib/database'
import products from '$lib/products'
import order from '$lib/order'
import { fail, error, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types.js'
import type { OrderInfo } from '$lib/order'

const addressInstance = new address(database)
const productInstance = new products(database)

export const load: PageServerLoad = async ({ url, locals }) => {
	let addresses, autoCheckoutItem
	let isAutoCheckout = false

	const selectedProductId = Number(url.searchParams.get('productId') ?? 'Suck my balls')
	const selectedQuantity = Number(url.searchParams.get('quantity') ?? 'Suck my balls')

	if (Number.isNaN(selectedProductId) || Number.isNaN(selectedQuantity))
		redirect(302, '/shop')
	else isAutoCheckout = true

	try {
		if (isAutoCheckout) {
			const retrievedItems = await productInstance.get(selectedProductId)
			autoCheckoutItem = {
				quantity: selectedQuantity,
				product: retrievedItems
			}
		}

		addresses = await addressInstance.getAll(locals?.profileId)

		if (isAutoCheckout)
			return {
				addressList: addresses,
				autoCheckout: isAutoCheckout,
				cartItems: autoCheckoutItem ? [autoCheckoutItem] : []
			}
		else return { addressList: addresses, autoCheckout: isAutoCheckout }
	} catch (err) {
		throw error(403, 'We have a problem, ladies and gentleman')
	}
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		let info: OrderInfo
		const data = Object.fromEntries(await request.formData())
		const orderInstance = new order(database)

		if (!data?.productId) {
			info = {
				profileId: locals?.profileId,
				shippingInfoId: String(data?.shippingInfoId),
				paymentMethod: String(data?.paymentMethod)
			}
		} else {
			info = {
				profileId: locals?.profileId,
				shippingInfoId: String(data?.shippingInfoId),
				paymentMethod: String(data?.paymentMethod),
				productId: Number(data?.productId ?? -1),
				quantity: Number(data?.quantity ?? -1)
			}
		}

		console.log(info)
		try {
			await orderInstance.checkout(info)
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			})
		}

		return { success: true }
	}
}
