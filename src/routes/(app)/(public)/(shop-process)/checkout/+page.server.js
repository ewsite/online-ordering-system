import address from '$lib/address';
import { database } from '$lib/database';
import products from '$lib/products';
import order from '$lib/order';
import { fail, error, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
	const addressInstance = new address(database);
	const productInstance = new products(database);
	let addresses;
	let isAutoCheckout = false;
	let autoCheckoutItem;
	const selectedProductId = Number(url.searchParams.get('productId') ?? 'Suck my balls');
	const selectedQuantity = Number(url.searchParams.get('quantity') ?? 'Suck my balls');
	if (Number.isNaN(selectedProductId) || Number.isNaN(selectedQuantity)) redirect(302, '/shop');
	else isAutoCheckout = true;

	try {
		if (isAutoCheckout) {
			const retrievedItems = await productInstance.get(selectedProductId);
			autoCheckoutItem = {
				quantity: selectedQuantity,
				product: retrievedItems
			};
		}

		addresses = await addressInstance.getAll(locals?.profileId ?? '');
	} catch (err) {
		throw error(403, 'We have a problem, ladies and gentleman');
	}

	if (isAutoCheckout)
		return {
			addressList: addresses,
			autoCheckout: isAutoCheckout,
			cartItems: autoCheckoutItem ? [autoCheckoutItem] : []
		};
	else return { addressList: addresses, autoCheckout: isAutoCheckout };
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());
		const orderInstance = new order(database);

		try {
			if (!data?.productId) {
				await orderInstance.checkout({
					profileId: String(locals?.profileId),
					shippingInfoId: data?.shippingInfoId,
					paymentMethod: data?.paymentMethod
				});
			} else {
				await orderInstance.autoCheckout({
					profileId: String(locals?.profileId),
					shippingInfoId: data?.shippingInfoId,
					paymentMethod: data?.paymentMethod,
					productId: Number(data?.productId ?? -1),
					quantity: Number(data?.quantity ?? 1)
				});
			}
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			});
		}
	}
};
