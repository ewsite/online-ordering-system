import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { formCheck } from './tools/Integrity';

// Set the limit of the quantity to the cart.
const QUANTITY_LIMIT = 100;

class cart {
	/**
	 * @param {import("@prisma/client").PrismaClient} db
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 * @param {{ profileId: string | FormDataEntryValue | null, productId: number | FormDataEntryValue | null, quantity: number | FormDataEntryValue | null }} info
	 */
	async add(info) {
		let data;
		const schema = {
			profileId: 'string',
			productId: 'number',
			quantity: 'number'
		};

		if (!formCheck(info, schema)) throw ERROR.D0001;

		if (Number(info.quantity) > QUANTITY_LIMIT) throw ERROR.C0002;

		try {
			data = await this.db.cart.create({
				data: {
					productId: Number(info.productId),
					profileId: String(info.profileId),
					quantity: Number(info.quantity)
				},
				include: {
					product: true
				}
			});
		} catch (error) {
			await this.db.$disconnect();

			if (error instanceof PrismaClientKnownRequestError) {
				switch (error.code) {
					case 'P2002':
						throw ERROR.P2002;
					case 'P2003':
						throw ERROR.P2003;
				}
			}
			console.error(error);
		}
		await this.db.$disconnect();

		if (!data) throw ERROR.C0001;

		return {
			cartId: data.id,
			productId: data.product.id,
			name: data.product.name,
			url_name: data.product.url_name,
			quantity: data.quantity
		};
	}

	/**
	 * @param {number  | FormDataEntryValue | null} cartId
	 * @param {string | FormDataEntryValue | null} profileId
	 */
	async delete(cartId, profileId) {
		if (!Number.isInteger(cartId) || !cartId) throw ERROR.D0001;

		try {
			await this.db.cart.delete({
				where: {
					id: Number(cartId),
					profileId: String(profileId)
				}
			});
		} catch (error) {
			await this.db.$disconnect();
			console.error(error);
			return false;
		}
		await this.db.$disconnect();
		return true;
	}
	/**
	 * @param {string | FormDataEntryValue | null} profileId
	 */
	async getAll(profileId) {
		let data;

		if (!profileId) return ERROR.D0001;

		try {
			data = await this.db.cart.findMany({
				where: { profileId: String(profileId) },
				include: { product: true }
			});
		} catch (error) {
			await this.db.$disconnect();
			console.error(error);
			return false;
		}
		await this.db.$disconnect();
		return data;
	}

	/**
	 * @param {Number | FormDataEntryValue | null} cartId
	 * @param {String | FormDataEntryValue | null} profileId
	 */
	async get(cartId, profileId) {
		let data;
		if (!Number.isInteger(cartId) || !profileId) throw ERROR.D0001;
		try {
			data = await this.db.cart.findUnique({
				where: { profileId: String(profileId), id: Number(cartId) },
				include: { product: true }
			});
		} catch (error) {
			await this.db.$disconnect();
			console.log(error);
			return false;
		}
		await this.db.$disconnect();
		return data;
	}

	/**
	 * @param {Number | FormDataEntryValue | null} cartId
	 * @param {String | FormDataEntryValue | null} profileId
	 * @param {{ quantity: number | null }} info
	 */
	async edit(cartId, profileId, info) {
		const schema = {
			quantity: 'number'
		};

		if (!Number.isInteger(cartId) || !profileId) throw ERROR.D0001;
		if (!formCheck(info, schema)) throw ERROR.D0001;
		if (Number(info.quantity) > QUANTITY_LIMIT) throw ERROR.C0002;
		try {
			await this.db.cart.update({
				data: { quantity: Number(info.quantity) },
				where: { id: Number(cartId), profileId: String(profileId) }
			});
		} catch (error) {
			await this.db.$disconnect();
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2025':
						throw ERROR.P2025;
				}
			}
			console.error(error);
			return false;
		}
		await this.db.$disconnect();
		return true;
	}
	/**
	 * @param {Number | FormDataEntryValue | undefined | null} productId
	 * @param {String | FormDataEntryValue | null} profileId
	 */
	async getUsingProductId(productId, profileId) {
		let data;
		if (!Number.isInteger(productId) || !productId) throw ERROR.D0001;

		try {
			data = await this.db.cart.findMany({
				where: { profileId: String(profileId), productId: Number(productId) }
			});
		} catch (error) {
			await this.db.$disconnect();
			console.log(error);
			return false;
		}
		await this.db.$disconnect();

		return data[0] ?? null;
	}
}

const ERROR = {
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
	}
};

export default cart;
