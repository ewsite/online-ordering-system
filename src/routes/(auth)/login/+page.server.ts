import { database } from '$lib/database'
import auth, { type AuthCredentials } from '$lib/auth'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const authInstance = new auth(database)
		const data = Object.fromEntries(await request.formData())
		let tokens

		const args: AuthCredentials = {
			username: String(data?.username),
			password: String(data?.password)
		}
		try {
			tokens = await authInstance.login(args)
		} catch (error) {
			return fail(401, {
				success: false,
				body: error
			})
		}

		cookies.set('_rtok', tokens?.refreshToken, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7
		})

		return {
			success: true,
			body: {
				message: 'Authenticated!'
			}
		}
	}
}
