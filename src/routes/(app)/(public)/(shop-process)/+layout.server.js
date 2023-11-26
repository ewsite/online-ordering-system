/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch, depends }) {
	depends('shop-process:reload');
	const cartItems = await (await fetch('api/cart')).json();
	return { cartItems: cartItems ?? [] };
}
