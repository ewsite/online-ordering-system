import type { LayoutServerLoad } from './$types'
export const load: LayoutServerLoad = async ({ fetch, depends }) => {
	depends('shop-process:reload')
	const cartItems: unknown = await (await fetch('api/cart')).json()
	return { cartItems: cartItems ?? [] }
}
