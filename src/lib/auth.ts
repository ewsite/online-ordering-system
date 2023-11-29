import jwt from 'jsonwebtoken'
import password from '$lib/password'
import type { PrismaClient } from '@prisma/client'
import type { TypeError } from './types'

export type AuthCredentials = {
	username: string
	password: string
}

export type AuthJwtPayload = {
	iss: string
	sub: string
	context: {
		profileId: string
		username: string
		role: string
	}
}

class auth {
	constructor(public db?: PrismaClient) {}
	async login(args: AuthCredentials): Promise<{ refreshToken: string }> {
		let userInfo

		if (!this.db) throw ERROR.MXXX

		try {
			userInfo = await this.db.credentials.findUnique({
				where: { username: args.username },
				include: { user: { include: { profile: true } } }
			})
		} catch (error) {
			await this.db?.$disconnect()
			console.error(error)
			throw ERROR.MXXX
		}
		await this.db?.$disconnect()

		if (!userInfo) {
			throw ERROR.P2003
		}

		const isPasswordCorrect = await password.verify(
			String(args.password),
			String(userInfo.password)
		)

		if (!isPasswordCorrect) throw ERROR.P2003

		return {
			refreshToken: jwt.sign(
				{
					iss: 'owwzonevapeshop',
					sub: userInfo.user.id,
					context: {
						profileId: userInfo?.user?.profile?.id,
						username: args.username,
						role: userInfo.role
					}
				},
				// @ts-expect-error No strict types for .env variables.
				process.env.SPICY_KEY2,
				{ expiresIn: '7d' }
			)
		}
	}

	requestAccessToken(refreshJwtToken: string): string | null {
		try {
			// @ts-expect-error No strict types for .env variables.
			jwt.verify(refreshJwtToken, process.env.SPICY_KEY2)
			const data = this.decodeToken(refreshJwtToken) as AuthJwtPayload
			return jwt.sign(
				{
					iss: 'owwzonevapeshop',
					sub: data.sub,
					context: data.context
				},
				// @ts-expect-error No strict types for .env variables.
				process.env.SPICY_KEY,
				{ expiresIn: '10m' }
			)
		} catch (e) {
			return null
		}
	}

	verifyAccessToken(accessJwtToken: string): boolean {
		try {
			// @ts-expect-error No strict types for .env variables.
			jwt.verify(accessJwtToken, process.env.SPICY_KEY)
		} catch (error) {
			return false
		}
		return true
	}

	decodeToken(anyJwtToken: string): AuthJwtPayload {
		return jwt.decode(anyJwtToken) as AuthJwtPayload
	}
}

const ERROR: TypeError = {
	P2003: {
		code: 'AUTH_INVALID',
		message: 'Username or Password is incorrect.'
	},
	MXXX: {
		code: 'UNKNOWN',
		message: 'Unknown Error.'
	}
}

export default auth
