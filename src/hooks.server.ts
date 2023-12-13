import auth from '$lib/auth'
import type { Handle } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
export const handle: Handle = async ({ event, resolve }) => {
	let filteredRoutes: string[]
	const authInstance = new auth()

	const unauthorizedRoute = {
		notLoggedIn: ['/dashboard', '/settings', '/checkout', '/cart'],
		loggedIn: ['/login', '/register'],
		user: ['/dashboard/customer', '/dashboard/product'],
		admin: ['/dashboard/order']
	}

	const accessToken = event.cookies.get('_atok') ?? null
	const refreshToken = event.cookies.get('_rtok') ?? null

	if (!refreshToken) {
		event.cookies.delete('_atok')
		event.locals.loggedIn = false
	} else {
		let newAccessToken: string | null
		newAccessToken = !accessToken
			? authInstance.requestAccessToken(refreshToken)
			: accessToken

		if (!newAccessToken) {
			event.cookies.delete('_atok')
			event.cookies.delete('_rtok')
			throw redirect(301, '/')
		} else {
			event.cookies.set('_atok', newAccessToken, {
				path: '/'
			})
			const tokens = authInstance.decodeToken(newAccessToken)
			// Add Basic information to the locals
			event.locals = {
				loggedIn: true,
				userId: tokens?.sub,
				profileId: tokens?.context?.profileId,
				username: tokens?.context?.username,
				role: tokens?.context?.role
			}
		}
	}

	if (event.locals.loggedIn) {
		filteredRoutes = [
			...unauthorizedRoute.loggedIn,
			...(event.locals.role != 'admin' ? unauthorizedRoute.user : unauthorizedRoute.admin)
		]
		for (const route of filteredRoutes) {
			if (event.url.pathname.startsWith(route)) throw redirect(302, '/')
		}
	} else {
		filteredRoutes = [...unauthorizedRoute.notLoggedIn]
		for (const route of filteredRoutes) {
			if (event.url.pathname.startsWith(route))
				throw redirect(
					301,
					`/login?redirect=${encodeURIComponent(
						event.url.pathname + String(event.url.search)
					)}`
				)
		}
	}

	const response = await resolve(event)

	return response
}
