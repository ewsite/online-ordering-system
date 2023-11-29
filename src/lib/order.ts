import { type PrismaClient, $Enums } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { TypeError } from './types'

export type OrderInfo = {
	profileId: App.Locals['profileId']
	shippingInfoId: string
	paymentMethod: string
	productId?: number
	quantity?: number
}

export type SetOrderArgs = {
	orderId: number
	profileId: string
	status: $Enums.OrderStatus
}

class order {
	constructor(public db: PrismaClient) {}

	async checkout(info: OrderInfo) {
		let cartInfoProps: object[]
		try {
			const productSelect = {
				id: true,
				url_name: true,
				name: true,
				price: true
			}

			if (info?.productId) {
				const selectedProduct = await this.db.products.findUniqueOrThrow({
					where: { id: info.productId },
					select: productSelect
				})
				cartInfoProps = [{ quantity: 1, product: selectedProduct }]
			} else {
				const selectedProducts = await this.db.cart.findMany({
					where: { profileId: String(info.profileId) },
					select: {
						quantity: true,
						product: {
							select: {
								id: true,
								url_name: true,
								name: true,
								price: true
							}
						}
					}
				})
				cartInfoProps = selectedProducts
			}
			if (!cartInfoProps.length) {
				throw ERROR.MXXX
			}
			const shippingInfo = await this.db.shippingInfo.findUniqueOrThrow({
				where: { id: info.shippingInfoId }
			})

			await this.db.$transaction([
				this.db.order.create({
					data: {
						products: [...cartInfoProps],
						profileId: String(info.profileId),
						shippingInfo: shippingInfo,
						paymentMethod: info.paymentMethod
					}
				}),
				this.db.cart.deleteMany({
					where: { profileId: String(info.profileId) }
				})
			])
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError) {
				switch (err.code) {
					case 'P2003':
						throw ERROR.P2003
				}
			}
			console.error(err)
			throw ERROR.MXXX
		}
	}
	async setOrderStatus(args: SetOrderArgs): Promise<boolean> {
		try {
			const { id } = await this.db.order.update({
				where: { id: args.orderId, profileId: String(args.profileId) },
				data: { orderStatus: args.status },
				select: { id: true }
			})

			if (!id) {
				return false
			}
		} catch (error) {
			console.error(error)
			throw ERROR.MXXX
		}

		return true
	}

	async getAll(profileId: App.Locals['profileId']) {
		let orders
		try {
			orders = await this.db.order.findMany({
				where: { profileId: profileId },
				include: { profile: true },
				orderBy: { orderedAt: 'desc' }
			})
		} catch (error) {
			await this.db.$disconnect()
			console.error(error)
			return []
		}
		await this.db.$disconnect()
		return orders ?? []
	}

	async getAllFromTheUsers(status: $Enums.OrderStatus) {
		let orders

		try {
			let where
			switch (status) {
				case $Enums.OrderStatus.BEGIN_ORDER:
					where = {
						where: {
							AND: { NOT: [{ orderStatus: 'DELIVERED' }, { orderStatus: 'CANCELLED' }] }
						}
					}
					break
				case $Enums.OrderStatus.DELIVERED:
					where = { where: { orderStatus: 'DELIVERED' } }
					break
				case $Enums.OrderStatus.CANCELLED:
					where = { where: { orderStatus: 'CANCELLED' } }
					break
				default:
					where = {}
			}
			orders = await this.db.order.findMany({
				...where,
				include: { profile: true },
				orderBy: { orderedAt: 'desc' }
			})
		} catch (error) {
			await this.db.$disconnect()
			console.error(error)
			throw ERROR.MXXX
		}

		return orders
	}
}
const ERROR: TypeError = {
	P2003: {
		code: 'ORDER_PROFILE_NOTFOUND',
		message: "Profile doesn't exists."
	},
	P2025: {
		code: 'CART_UPDATE_ID_INVALID',
		message: 'One of the key requirements for updating the cart is invalid.'
	},
	D0001: {
		code: 'DATA_INVALID',
		message: 'Invalid Data.'
	},
	D2003: {
		code: 'ORDER_SHIPPING_NOTFOUND',
		message: "Shipping address doesn't exists."
	},
	MXXX: {
		code: 'UNKNOWN',
		message: 'Unknown Error.'
	}
}
export default order
