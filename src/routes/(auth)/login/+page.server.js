import { database } from '$lib/database';
import auth from '$lib/auth';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ request, cookies }) => {
		const authInstance = new auth(database);
		const data = Object.fromEntries(await request.formData());
		let tokens;
		try {
			tokens = await authInstance.login(String(data?.username), String(data?.password));
		} catch (error) {
			return fail(401, {
				success: false,
				body: error
			});
		}

		cookies.set('_rtok', tokens?.refreshToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7
		});

		return {
			success: true,
			body: {
				message: 'Authenticated!'
			}
		};
	}
};
