import { formCheck } from './tools/Integrity';

class order {
	/**
	 * @param {import('@prisma/client').PrismaClient} db
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 * @param {{profileId: string | null, shippingInfoId: string | FormDataEntryValue | null, paymentMethod: string | FormDataEntryValue | null}} info
	 */
	async checkout(info) {
		const schema = {
			profileId: 'string',
			shippingInfoId: 'string',
			paymentMethod: 'string'
		};

		if (!formCheck(info, schema)) throw ERROR.D0001;

		let result = await this.db.$transaction([
			this.db.cart.findMany({
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
			}),
			this.db.shippingInfo.findUnique({
				where: { id: String(info.shippingInfoId) }
			})
		]);

		if (!result[0]?.length) throw ERROR.P2003;
		if (!result[1]) throw ERROR.D2003;

		const carts = result[0];
		const shippingInfo = result[1];

		try {
			await this.db.$transaction([
				this.db.order.create({
					data: {
						products: carts,
						profileId: info.profileId,
						shippingInfo: shippingInfo,
						paymentMethod: String(info.paymentMethod)
					}
				}),
				this.db.cart.deleteMany({
					where: { profileId: String(info.profileId) }
				})
			]);
		} catch (error) {
			await this.db.$disconnect();
			console.error(error);
			return;
		}

		await this.db.$disconnect();
		return true;
	}
	/**
	 * @param {{profileId: string | null, shippingInfoId: string | FormDataEntryValue | null, paymentMethod: string | FormDataEntryValue | null, productId: number | FormDataEntryValue | null, quantity: number | FormDataEntryValue | null}} info
	 */
	async autoCheckout(info) {
		const schema = {
			profileId: 'string',
			shippingInfoId: 'string',
			paymentMethod: 'string',
			productId: 'number',
			quantity: 'number'
		};

		if (!formCheck(info, schema)) throw ERROR.D0001;

		let result = await this.db.$transaction([
			this.db.products.findUnique({
				where: { id: Number(info.productId) },
				select: {
					id: true,
					url_name: true,
					name: true,
					price: true
				}
			}),
			this.db.shippingInfo.findUnique({
				where: { id: String(info.shippingInfoId) }
			})
		]);

		if (!result[0]) throw ERROR.P2003;
		if (!result[1]) throw ERROR.D2003;

		const carts = [
			{
				quantity: Number(info.quantity),
				product: result[0]
			}
		];
		const shippingInfo = result[1];

		try {
			await this.db.$transaction([
				this.db.order.create({
					data: {
						products: carts,
						profileId: info.profileId,
						shippingInfo: shippingInfo,
						paymentMethod: String(info.paymentMethod)
					}
				})
			]);
		} catch (error) {
			await this.db.$disconnect();
			console.error(error);
			return;
		}

		await this.db.$disconnect();
		return true;
	}

	/**
	 * @param {number | FormDataEntryValue | null} [orderId]
	 * @param {string | FormDataEntryValue | null} [profileId]
	 * @param {import("@prisma/client").$Enums.OrderStatus} [orderStatus]
	 */
	async setOrderStatus(orderId, profileId, orderStatus) {
		if (!orderId || !profileId || !orderStatus) throw ERROR.D0001;
		try {
			await this.db.order.update({
				where: { id: Number(orderId), profileId: String(profileId) },
				data: { orderStatus: orderStatus }
			});
		} catch (error) {
			console.error(error);
			return;
		}

		return true;
	}

	/**
	 * @param {string} profileId
	 */
	async getAll(profileId) {
		let orders;
		try {
			orders = await this.db.order.findMany({
				where: { profileId: profileId },
				include: { profile: true },
				orderBy: { orderedAt: 'desc' }
			});
		} catch (error) {
			await this.db.$disconnect();
			console.error(error);
			return [];
		}
		await this.db.$disconnect();
		return orders;
	}

	/**
	 *
	 * @param {string | null | undefined} filterOrderStatus
	 * @returns
	 */
	async getAllFromTheUsers(filterOrderStatus) {
		let orders;
		let where = {};
		try {
			switch (filterOrderStatus) {
				case 'AWAIT':
					where = {
						where: { AND: { NOT: [{ orderStatus: 'DELIVERED' }, { orderStatus: 'CANCELLED' }] } }
					};
					break;
				case 'DELIVERED':
					where = { where: { orderStatus: 'DELIVERED' } };
					break;
				case 'CANCELLED':
					where = { where: { orderStatus: 'CANCELLED' } };
					break;
				default:
					where = {};
			}
			orders = await this.db.order.findMany({
				...where,
				include: { profile: true },
				orderBy: { orderedAt: 'desc' }
			});
		} catch (error) {
			await this.db.$disconnect();
			console.error(error);
			return [];
		}

		return orders;
	}
}
const ERROR = {
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
	}
};
export default order;
