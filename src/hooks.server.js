import auth from '$lib/auth';
import { redirect } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').Handle} */

export async function handle({ event, resolve }) {
	const unauthorizedRoute = {
		notLoggedIn: ['/dashboard', '/settings', '/checkout', '/cart'],
		loggedIn: ['/login', '/register'],
		user: ['/dashboard/customer', '/dashboard/product'],
		admin: ['/dashboard/order']
	};

	let filteredRoutes = [];
	const authInstance = new auth(null);
	let accessToken = event.cookies.get('_atok') ?? null;
	const refreshToken = event.cookies.get('_rtok') ?? null;

	if (!refreshToken) {
		event.cookies.delete('_atok');
		event.locals.loggedIn = false;
	} else {
		if (!accessToken || !authInstance.verifyAccessToken(accessToken)) {
			accessToken = authInstance.requestAccessToken(refreshToken);
			event.cookies.set('_atok', accessToken, {
				path: '/'
			});
		}

		if (!accessToken) {
			event.cookies.delete('_atok');
			event.cookies.delete('_rtok');
			throw redirect(301, '/');
		}

		const tokens = authInstance.decodeToken(accessToken);

		// Add Basic information to the locals

		event.locals = {
			loggedIn: true,
			userId: tokens?.sub,
			profileId: tokens?.context?.profileId,
			username: tokens?.context?.username,
			role: tokens?.context?.role
		};
	}

	if (event.locals.loggedIn) {
		filteredRoutes = [
			...unauthorizedRoute.loggedIn,
			...Array(event.locals.role != 'admin' ? unauthorizedRoute.user : unauthorizedRoute.admin)
		];
		for (const route of filteredRoutes) {
			if (event.url.pathname.startsWith(route)) throw redirect(302, '/');
		}
	} else {
		filteredRoutes = [...unauthorizedRoute.notLoggedIn];
		for (const route of filteredRoutes) {
			if (event.url.pathname.startsWith(route))
				throw redirect(
					301,
					`/login?redirect=${encodeURIComponent(event.url.pathname + (event.url.search ?? ''))}`
				);
		}
	}

	const response = await resolve(event);
	return response;
}
