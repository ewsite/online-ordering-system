import address, { type ShippingAddressArgs, type ShippingAddressInfo } from '$lib/address'
import { database } from '$lib/database'
import { fail, error } from '@sveltejs/kit'
import type { Actions } from './$types.js'
const addressInstance = new address(database)
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
	depends('settings-address:load')
	try {
		const addresses = await addressInstance.getAll(locals.profileId)
		return { addressList: addresses }
	} catch (err) {
		throw error(403, 'We have a problem, ladies and gentleman')
	}
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData())

		const info: ShippingAddressInfo = {
			firstName: String(data?.firstName),
			lastName: String(data?.lastName),
			streetBldgName: String(data?.streetBldgName),
			unitFloor: String(data?.unitFloor),
			barangay: String(data?.barangay),
			city: String(data?.city),
			province: String(data?.province)
		}

		console.log(locals?.profileId)
		try {
			await addressInstance.add(String(locals?.profileId), info)
		} catch (error) {
			return fail(401, {
				success: false,
				body: error
			})
		}
		return { success: true }
	},
	edit: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData())

		const info: ShippingAddressInfo = {
			firstName: String(data?.firstName),
			lastName: String(data?.lastName),
			streetBldgName: String(data?.streetBldgName),
			unitFloor: String(data?.unitFloor),
			barangay: String(data?.barangay),
			city: String(data?.city),
			province: String(data?.province)
		}

		const args: ShippingAddressArgs = {
			profileId: locals.profileId,
			addressId: String(data?.id)
		}

		try {
			await addressInstance.edit(args, info)
		} catch (error) {
			return fail(401, {
				success: false,
				body: error
			})
		}
		return { success: true }
	},
	remove: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData())

		const args: ShippingAddressArgs = {
			profileId: locals.profileId,
			addressId: String(data?.id)
		}

		try {
			await addressInstance.remove(args)
		} catch (error) {
			return fail(401, {
				success: false,
				body: error
			})
		}
		return { success: true }
	}
}
