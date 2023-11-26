import jwt from 'jsonwebtoken';
import password from '$lib/password';

class auth {
	/**
	 * @param {import("./database").database} db ||
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 * @param {String | FormDataEntryValue | null} usernameFromForm
	 * @param {String | FormDataEntryValue | null} passwordFromForm
	 */
	async login(usernameFromForm, passwordFromForm) {
		let userInfo;
		try {
			userInfo = await this.db.credentials.findUnique({
				where: { username: String(usernameFromForm) },
				include: { user: { include: { profile: true } } }
			});
		} catch (error) {
			await this.db?.$disconnect();
			console.error(error);
			return;
		}
		await this.db?.$disconnect();
		if (!userInfo) {
			throw ERROR.P2003;
		}

		const isPasswordCorrect = await password.verify(
			String(passwordFromForm),
			String(userInfo.password)
		);

		if (!isPasswordCorrect) throw ERROR.P2003;

		return {
			refreshToken: jwt.sign(
				{
					iss: 'owwzonevapeshop',
					sub: userInfo.user.id,
					context: {
						profileId: userInfo?.user?.profile?.id,
						username: usernameFromForm,
						role: userInfo.role
					}
				},
				// @ts-ignore
				process.env.SPICY_KEY2,
				{ expiresIn: '7d' }
			)
		};
	}

	/**
	 * @param {string} refreshJwtToken
	 * @returns {string | null}
	 */
	requestAccessToken(refreshJwtToken) {
		try {
			// @ts-ignore
			jwt.verify(refreshJwtToken, process.env.SPICY_KEY2);
			const data = this.decodeToken(refreshJwtToken);
			return jwt.sign(
				{
					iss: 'owwzonevapeshop',
					sub: data?.sub,
					context: data?.context
				},
				process.env.SPICY_KEY,
				{ expiresIn: '10m' }
			);
		} catch (e) {
			return null;
		}
	}

	/**
	 * @param {import("jsonwebtoken").Jwt | string} accessJwtToken
	 */
	verifyAccessToken(accessJwtToken) {
		try {
			// @ts-ignore
			jwt.verify(accessJwtToken, process.env.SPICY_KEY);
		} catch (error) {
			return false;
		}
		return true;
	}

	/**
	 * @param {string} anyJwtToken
	 * @returns {import("jsonwebtoken").JwtPayload | null | string}
	 */
	decodeToken(anyJwtToken) {
		return jwt.decode(anyJwtToken);
	}
}

const ERROR = {
	P2003: {
		code: 'AUTH_INVALID',
		message: 'Username or Password is incorrect.'
	}
};

export default auth;
