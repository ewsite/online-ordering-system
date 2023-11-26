/** @type {import('./$types').LayoutServerLoad} */
export async function load({ url, locals }) {
	return {
		url: url?.pathname,
		userInfo: locals
	};
}
