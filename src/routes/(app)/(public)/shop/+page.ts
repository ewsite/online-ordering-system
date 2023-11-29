import type { PageLoad } from './$types'
export const load: PageLoad = async ({ fetch }) => {
	const products = await (await fetch('/api/products')).json()
	return { products }
}
