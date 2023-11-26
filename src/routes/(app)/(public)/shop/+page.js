/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const products = await (await fetch('/api/products')).json();
	return { products };
}
