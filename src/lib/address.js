import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { formCheck } from './tools/Integrity';

class address {
	/**
	 * @param {import('@prisma/client').PrismaClient} db
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 * @param {string} profileId
	 * @param {{
	 *      firstName: string | FormDataEntryValue,
	 *      lastName: string | FormDataEntryValue,
	 *      streetBldgName: string | FormDataEntryValue,
	 *      unitFloor: string | FormDataEntryValue,
	 *      barangay: string | FormDataEntryValue,
	 *      city: string | FormDataEntryValue,
	 *      province: string | FormDataEntryValue
	 * }} info
	 */
	async add(profileId, info) {
		const schema = {
			firstName: 'string',
			lastName: 'string',
			streetBldgName: 'string',
			unitFloor: 'string',
			barangay: 'string',
			city: 'string',
			province: 'string'
		};

		const filteredData = formCheck(info, schema, true);

		if (!filteredData) throw ERROR.D0001;

		console.log({ profileId: String(profileId), ...filteredData });

		try {
			await this.db.shippingInfo.create({
				data: { profileId: String(profileId), ...filteredData }
			});
		} catch (error) {
			await this.db.$disconnect();
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2003':
						throw ERROR.P2003;
				}
			}
			console.error('Theres an error', error);
			return;
		}
		await this.db.$disconnect();
		return true;
	}
	/**
	 * @param {string | FormDataEntryValue | null} profileId
	 * @param {string | FormDataEntryValue | null} addressId
	 * @param {{}} info
	 */
	async edit(profileId, addressId, info) {
		if (!profileId || !addressId) throw ERROR.D0001;

		const schema = {
			firstName: 'string',
			lastName: 'string',
			streetBldgName: 'string',
			unitFloor: 'string',
			barangay: 'string',
			city: 'string',
			province: 'string'
		};

		const filteredData = formCheck(info, schema, true);

		if (!filteredData) throw ERROR.D0001;

		try {
			await this.db.shippingInfo.update({
				data: { ...filteredData },
				where: { id: String(addressId), profileId: String(profileId) }
			});
		} catch (error) {
			await this.db.$disconnect();
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2003':
						throw ERROR.P2003;
				}
			}
			console.error(error);
			return;
		}
		await this.db.$disconnect();
		return true;
	}
	/**
	 *
	 * @param {String | FormDataEntryValue | null} profileId
	 */
	async getAll(profileId) {
		if (!String(profileId)) throw ERROR.D0001;

		let data;
		try {
			data = await this.db.shippingInfo.findMany({
				where: { profileId: String(profileId) }
			});
		} catch (error) {
			await this.db.$disconnect();
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2003':
						throw ERROR.P2003;
				}
			}
			console.error(error);
			return;
		}
		await this.db.$disconnect();
		return data;
	}
	/**
	 *
	 * @param {string | FormDataEntryValue | null} profileId
	 * @param {string | FormDataEntryValue | null} addressId
	 */
	async remove(profileId, addressId) {
		let data;

		if (!profileId || !addressId) throw ERROR.D0001;

		try {
			data = await this.db.shippingInfo.delete({
				where: { profileId: String(profileId), id: String(addressId) },
				select: { id: true }
			});
		} catch (error) {
			await this.db.$disconnect();
			console.error(error);
			return;
		}
		await this.db.$disconnect();
		if (!data?.id) throw ERROR.P202X;
		return true;
	}
}
const ERROR = {
	P2002: {
		code: 'CART_ALREADY_EXISTS',
		message: 'This cart already exists to your account'
	},
	P2003: {
		code: 'ADDRESS_PROFILE_NOTFOUND',
		message: "Profile doesn't exist."
	},
	P202X: {
		code: 'ADDRESS_DELETE_ID_INVALID',
		message: 'One of the key requirements for deleting existing address is invalid.'
	},
	D0001: {
		code: 'DATA_INVALID',
		message: 'Invalid Data.'
	}
};

export default address;
