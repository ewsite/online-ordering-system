import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { PrismaClient } from '@prisma/client'
import type { TypeError } from './types'

export type ShippingAddressInfo = {
	firstName: string
	lastName: string
	streetBldgName: string
	unitFloor?: string
	barangay: string
	city: string
	province: string
}

export type ShippingAddressArgs = {
	profileId: App.Locals['profileId']
	addressId: string
}

class address {
	constructor(public db: PrismaClient) {}

	async add(profileId: ShippingAddressArgs['profileId'], info: ShippingAddressInfo) {
		try {
			await this.db.shippingInfo.create({
				data: { profileId: String(profileId), ...info }
			})
		} catch (error) {
			await this.db.$disconnect()
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2003':
						throw ERROR.P2003
				}
			}
			console.error('Theres an error', error)
			return
		}
		await this.db.$disconnect()
		return true
	}

	async edit(args: ShippingAddressArgs, info: ShippingAddressInfo): Promise<boolean> {
		try {
			const { id } = await this.db.shippingInfo.update({
				data: info,
				where: { id: args.addressId, profileId: String(args.profileId) },
				select: { id: true }
			})

			if (!id) {
				return false
			}
		} catch (error) {
			await this.db.$disconnect()
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2003':
						throw ERROR.P2003
				}
			}
			console.error(error)
			throw ERROR.MXXX
		}
		await this.db.$disconnect()
		return true
	}

	async getAll(profileId: ShippingAddressArgs['profileId']) {
		let data
		try {
			data = await this.db.shippingInfo.findMany({
				where: { profileId: String(profileId) }
			})
		} catch (error) {
			await this.db.$disconnect()
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2003':
						throw ERROR.P2003
				}
			}
			console.error(error)
			throw ERROR.MXXX
		}
		await this.db.$disconnect()
		return data
	}

	async remove(args: ShippingAddressArgs): Promise<boolean> {
		let data

		try {
			data = await this.db.shippingInfo.delete({
				where: { profileId: String(args.profileId), id: args.addressId },
				select: { id: true }
			})
		} catch (error) {
			await this.db.$disconnect()
			console.error(error)
			throw ERROR.MXXX
		}
		await this.db.$disconnect()
		if (!data?.id) throw ERROR.P202X
		return true
	}
}
const ERROR: TypeError = {
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
	},
	MXXX: {
		code: 'UNKNOWN',
		message: 'Unknown Error.'
	}
}

export default address
