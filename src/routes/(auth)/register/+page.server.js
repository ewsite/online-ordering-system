import { database } from '$lib/database';
import user from '$lib/user';
import { fail, redirect } from '@sveltejs/kit';

const userInstance = new user(database);

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	if (url.pathname.startsWith('/register')) throw redirect(301, url.pathname + '/confirm-age');
}
/** @type {import('./$types').Actions} */
export const actions = {
	register: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());

		let _data = {
			username: data?.username,
			password: data?.password,
			age: Number(data?.age ?? 'a'),
			firstName: data?.firstName,
			lastName: data?.lastName,
			role: 'user'
		};
		try {
			await userInstance.add(_data);
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			});
		}

		return {
			message: 'Hi Honey!'
		};
	}
};
