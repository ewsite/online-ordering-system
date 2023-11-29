// Temporary only
import { database } from '$lib/database'
import { fail, type Actions } from '@sveltejs/kit'

export const actions: Actions = {
	checkUsername: async ({ request }) => {
		const data = Object.fromEntries(await request.formData())

		const existedUsername = await database.credentials.findUnique({
			where: { username: String(data?.username) },
			select: { username: true }
		})

		if (existedUsername) {
			return fail(400, {
				success: true,
				message: `Username "${existedUsername.username}" already exists.`
			})
		} else {
			return {
				success: true,
				message: `No username found. Continue.`
			}
		}
	}
}
