// Temporary only
import { database } from '$lib/database';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	checkUsername: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());

		const existedUsername = await database.credentials.findUnique({
			where: { username: String(data?.username) },
			select: { username: true }
		});

		if (existedUsername) {
			return fail(400, {
				success: true,
				message: `Username "${existedUsername.username}" already exists.`
			});
		} else {
			return {
				success: true,
				message: `No username found. Continue.`
			};
		}
	}
};
