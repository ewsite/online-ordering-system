import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { PrismaClient } from '@prisma/client'
import type { TypeError } from './types'

// Set the limit of the quantity to the cart.
const QUANTITY_LIMIT = 100

export type CartInfo = {
	profileId: App.Locals['profileId']
	productId: number
	quantity: number
}

export type CartArgs = {
	profileId: App.Locals['profileId']
	cartId: number
	productId?: number
}

export type CartResult = {
	quantity: number
	product: {
		name: string
		url_name: string
		id: number
		price: number
	}
}
class cart {
	constructor(public db: PrismaClient) {}

	async add(info: CartInfo) {
		let data

		if (Number(info.quantity) > QUANTITY_LIMIT) throw ERROR.C0002

		try {
			data = await this.db.cart.create({
				data: {
					productId: Number(info.productId),
					profileId: String(info.profileId),
					quantity: info.quantity
				},
				include: {
					product: true
				}
			})
		} catch (error) {
			await this.db.$disconnect()

			if (error instanceof PrismaClientKnownRequestError) {
				switch (error.code) {
					case 'P2002':
						throw ERROR.P2002
					case 'P2003':
						throw ERROR.P2003
				}
			}
			console.error(error)
		}
		await this.db.$disconnect()

		if (!data) throw ERROR.C0001

		return {
			cartId: data.id,
			productId: data.product.id,
			name: data.product.name,
			url_name: data.product.url_name,
			quantity: data.quantity
		}
	}

	async delete(args: CartArgs): Promise<boolean> {
		try {
			const { id } = await this.db.cart.delete({
				where: { id: args.cartId, profileId: String(args.profileId) },
				select: { id: true }
			})

			if (!id) return false
		} catch (error) {
			await this.db.$disconnect()
			console.error(error)
			throw ERROR.MXXX
		}
		await this.db.$disconnect()
		return true
	}

	async getAll(profileId: CartArgs['profileId']) {
		let data

		if (!String(profileId)) return ERROR.D0001

		try {
			data = await this.db.cart.findMany({
				where: { profileId: String(profileId) },
				include: { product: true }
			})
		} catch (error) {
			await this.db.$disconnect()
			console.error(error)
			return false
		}
		await this.db.$disconnect()
		return data
	}

	async get(args: CartArgs) {
		let data
		if (!Number.isInteger(args.cartId) || !args.profileId) throw ERROR.D0001
		try {
			data = await this.db.cart.findUnique({
				where: { profileId: String(args.profileId), id: Number(args.cartId) },
				include: { product: true }
			})
		} catch (error) {
			await this.db.$disconnect()
			console.log(error)
			throw ERROR.MXXX
		}

		await this.db.$disconnect()
		return data
	}

	async edit(args: CartArgs, quantity: CartInfo['quantity']) {
		try {
			const { id } = await this.db.cart.update({
				data: { quantity: quantity },
				where: { id: args.cartId, profileId: String(args.profileId) },
				select: { id: true }
			})

			if (!id) return false
		} catch (error) {
			await this.db.$disconnect()
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2025':
						throw ERROR.P2025
				}
			}
			console.error(error)
			return ERROR.MXXX
		}
		await this.db.$disconnect()
		return true
	}

	async getUsingProductId(
		profileId: CartArgs['profileId'],
		productId: CartArgs['productId']
	) {
		let data
		if (!Number.isInteger(productId) || !productId) throw ERROR.D0001
		try {
			data = await this.db.cart.findMany({
				where: { profileId: String(profileId), productId: productId }
			})
		} catch (error) {
			await this.db.$disconnect()
			console.log(error)
			throw ERROR.MXXX
		}
		await this.db.$disconnect()

		return data.length ? data[0] : null
	}
}

const ERROR: TypeError = {
	P2002: {
		code: 'CART_ALREADY_EXISTS',
		message: 'This cart already exists to your account'
	},
	P2003: {
		code: 'CART_PROFILE_NOTFOUND',
		message: "Profile doesn't exist."
	},
	P2025: {
		code: 'CART_UPDATE_ID_INVALID',
		message: 'One of the key requirements for cart operations is/are invalid.'
	},

	C0001: {
		code: 'CART_CREATE_FAILED',
		message: 'Failed to create a cart'
	},
	C0002: {
		code: 'CART_QUANTITY_EXCEED_LIMIT',
		message: 'The quantity of the product has exceed the limit.'
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

export default cart
