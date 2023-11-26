import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	throw redirect(302, url.pathname + '/address');
}
