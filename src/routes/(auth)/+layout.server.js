/** @type {import('./$types').LayoutServerLoad} */
export async function load({ url }) {
	// console.log("Time of motherfucker" + locals.accessToken);
	/**
	 * @type {{ url: string, redirect: string? }}
	 */
	const data = {
		url: url?.pathname,
		redirect: null
	};

	if (url.searchParams.get('redirect')) {
		data.redirect = decodeURIComponent(String(url.searchParams.get('redirect')));
	}
	return data;
}
