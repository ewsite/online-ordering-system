import password from './password';
import { PrismaClient } from '@prisma/client';
import { configDotenv } from 'dotenv';

configDotenv();
/**
 * @type {PrismaClient}
 */
const database = new PrismaClient();

async function initialize() {
	try {
		// Delete all data from all tables.
		await database.user.deleteMany();
		await database.cart.deleteMany();
		await database.products.deleteMany();
		await database.order.deleteMany();
		await database.shippingInfo.deleteMany();

		// Initialize two important accounts to the database
		const initUserReport = await database.$transaction([
			database.user.create({
				data: {
					credentials: {
						create: {
							username: 'admin',
							password: password.hash('admin'),
							role: 'admin'
						}
					},
					profile: {
						create: {
							firstName: 'Admin',
							lastName: 'Host',
							age: 99
						}
					}
				}
			}),
			database.user.create({
				data: {
					credentials: {
						create: {
							username: 'user',
							password: password.hash('meanttobe')
						}
					},
					profile: {
						create: {
							firstName: 'Local',
							lastName: 'User',
							age: 18
						}
					}
				}
			})
		]);

		console.log(initUserReport);
	} catch (error) {
		await database.$disconnect();
		// @ts-ignore
		switch (error.code) {
			case 'P2002':
				console.log('User already exists.');
				break;
			default:
				console.log(error);
		}
		return false;
	}
	await database.$disconnect();
	return true;
}
export { database, initialize };
