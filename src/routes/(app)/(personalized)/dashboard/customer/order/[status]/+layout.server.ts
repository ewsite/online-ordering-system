import { redirect } from '@sveltejs/kit'
const allowedStatus = ['begin_order', 'cancelled', 'delivered']

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
	if (!allowedStatus.includes(params.status)) throw redirect(301, '/dashboard')

	return { selectedStatus: params.status }
}
