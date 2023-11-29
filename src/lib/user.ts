import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import password from './password'
import type { PrismaClient } from '@prisma/client'
import type { TypeError } from './types'

export type AddUserInfo = {
	username: string
	password: string
	firstName: string
	lastName: string
	age: number
	role?: string
}

class user {
	constructor(public db: PrismaClient) {}
	async add(info: AddUserInfo): Promise<boolean> {
		// Check if the user is adult. It is not allowed to add this "illegal" user becuase
		// this service involves the purchase of smoking products.
		if (info.age < 18) throw ERROR.R0001

		try {
			await this.db.user.create({
				data: {
					credentials: {
						create: {
							username: info.username,
							password: password.hash(info.password),
							role: String(info?.role ?? 'user')
						}
					},
					profile: {
						create: {
							firstName: info.firstName,
							lastName: info.lastName,
							age: info.age
						}
					}
				}
			})
		} catch (err) {
			await this.db.$disconnect()
			if (err instanceof PrismaClientKnownRequestError) {
				switch (err?.code) {
					case 'P2002':
						throw ERROR.P2002
				}
			}
			console.error(err)
			throw ERROR.MXXX
		}
		await this.db.$disconnect()
		return true
	}

	async get(userId: App.Locals['userId']) {
		let userData

		try {
			userData = await this.db.user.findUniqueOrThrow({
				where: { id: String(userId) },
				select: { profile: true }
			})
		} catch (error) {
			await this.db.$disconnect()
			console.error(error)
			throw ERROR.MXXX
		}
		await this.db.$disconnect()

		if (!userData) throw ERROR.D0002

		return userData
	}
}
const ERROR: TypeError = {
	P2002: {
		code: 'USERNAME_EXISTS',
		stepRedirect: 3,
		message: 'Username already exists.'
	},
	D0002: {
		code: 'USER_NOTFOUND',
		message: 'User not found'
	},
	R0001: {
		code: 'AGE_INVALID',
		stepRedirect: 1,
		message: "This service doesn't allowed minor person for legal reasons."
	},

	D0001: {
		code: 'DATA_INVALID',
		message: 'Invalid Data.'
	},
	MXXX: {
		code: 'UNKNOWN',
		message: 'Unknown Error.'
	}
}

export default user
