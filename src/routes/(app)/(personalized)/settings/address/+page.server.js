import address from '$lib/address';
import { database } from '$lib/database';
import { fail, error } from '@sveltejs/kit';
const addressInstance = new address(database);
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, depends }) {
	depends('settings-address:load');
	try {
		const addresses = await addressInstance.getAll(String(locals?.profileId));
		return { addressList: addresses ?? [] };
	} catch (err) {
		throw error(403, 'We have a problem, ladies and gentleman');
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		const info = {
			firstName: data?.firstName,
			lastName: data?.lastName,
			streetBldgName: data?.streetBldgName,
			unitFloor: String(data?.unitFloor),
			barangay: data?.barangay,
			city: data?.city,
			province: data?.province
		};

		console.log(locals?.profileId);
		try {
			await addressInstance.add(String(locals?.profileId), info);
		} catch (error) {
			return fail(401, {
				success: false,
				body: error
			});
		}
	},
	edit: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		const info = {
			firstName: data?.firstName,
			lastName: data?.lastName,
			streetBldgName: data?.streetBldgName,
			unitFloor: String(data?.unitFloor),
			barangay: data?.barangay,
			city: data?.city,
			province: data?.province
		};
		try {
			await addressInstance.edit(String(locals?.profileId), data?.id, info);
		} catch (error) {
			return fail(401, {
				success: false,
				body: error
			});
		}
	},
	remove: async ({ request, locals }) => {
		const data = Object.fromEntries(await request.formData());

		try {
			await addressInstance.remove(locals?.profileId, data?.id);
		} catch (error) {
			return fail(401, {
				success: false,
				body: error
			});
		}
	}
};
