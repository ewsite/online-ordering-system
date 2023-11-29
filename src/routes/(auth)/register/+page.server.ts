import { database } from '$lib/database'
import user, { type AddUserInfo } from '$lib/user'
import { fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
const userInstance = new user(database)

export const load: PageServerLoad = async ({ url }) => {
	if (url.pathname.startsWith('/register'))
		throw redirect(301, url.pathname + '/confirm-age')
}

export const actions: Actions = {
	register: async ({ request }) => {
		const data = Object.fromEntries(await request.formData())

		const info: AddUserInfo = {
			username: String(data?.username),
			password: String(data?.password),
			age: Number(data?.age ?? 'kyoumoukawaii'),
			firstName: String(data?.firstName),
			lastName: String(data?.lastName),
			role: 'user'
		}

		try {
			await userInstance.add(info)
		} catch (error) {
			return fail(400, {
				success: false,
				body: error
			})
		}

		return { success: true }
	}
}
