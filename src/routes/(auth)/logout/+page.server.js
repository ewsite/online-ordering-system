/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	cookies.delete('_rtok')
	cookies.delete('_atok')
}
