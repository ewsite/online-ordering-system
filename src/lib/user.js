import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import password from './password';
import { formCheck } from './tools/Integrity';
class user {
	/**
	 * @param {import('@prisma/client').PrismaClient} db
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 * @param {{ username: string | FormDataEntryValue | null, password: string | FormDataEntryValue | null, firstName: string | FormDataEntryValue | null, lastName: string | FormDataEntryValue | null, age: Number | FormDataEntryValue | null, role: string | FormDataEntryValue | null}} info
	 */
	async add(info) {
		let infoSchema = {
			username: 'string',
			password: 'string',
			firstName: 'string',
			lastName: 'string',
			age: 'number'
		};

		const filteredData = formCheck(info, infoSchema, true);

		if (!filteredData) throw ERROR.D0001;

		// Check if the user is adult. It is not allowed to add this "illegal" user becuase
		// this service involves the purchase of smoking products.
		if (filteredData.age < 18) throw ERROR.R0001;

		try {
			await this.db.user.create({
				data: {
					credentials: {
						create: {
							username: filteredData.username,
							password: password.hash(filteredData.password)
						}
					},
					profile: {
						create: {
							firstName: filteredData.firstName,
							lastName: filteredData.lastName,
							age: filteredData.age
						}
					}
				}
			});
		} catch (error) {
			await this.db.$disconnect();
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2002':
						throw ERROR.P2002;
				}
			}
			console.log(error);
			return;
		}
		await this.db.$disconnect();
		return true;
	}

	/**
	 *
	 * @param {string | FormDataEntryValue | null} userId
	 */
	async get(userId) {
		let userData;

		if (!userId) throw ERROR.D0001;

		try {
			userData = await this.db.user.findUnique({
				where: { id: String(userId) },
				select: { profile: true }
			});
		} catch (error) {
			await this.db.$disconnect();
			console.error(error);
			return;
		}
		await this.db.$disconnect();

		if (!userData) throw ERROR.D0002;

		return userData;
	}
}
const ERROR = {
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
	}
};

export default user;
