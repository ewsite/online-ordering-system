import type { LayoutServerLoad } from './$types'
export const load: LayoutServerLoad = async ({ url }) => {
	const data = {
		url: url?.pathname,
		redirect: String() ?? null
	}

	if (url.searchParams.get('redirect')) {
		data.redirect = decodeURIComponent(String(url.searchParams.get('redirect')))
	}
	return data
}
