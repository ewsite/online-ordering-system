import password from './password'
import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { configDotenv } from 'dotenv'

configDotenv()

const database: PrismaClient = new PrismaClient({
	'errorFormat': {
		
	}
})


database.$on('error' => {

})
async function initialize(): Promise<boolean> {
	try {
		// Delete all data from all tables.
		await database.user.deleteMany()
		await database.cart.deleteMany()
		await database.products.deleteMany()
		await database.order.deleteMany()
		await database.shippingInfo.deleteMany()

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
		])

		console.log(initUserReport)
	} catch (error) {
		await database.$disconnect()
		if (error instanceof PrismaClientKnownRequestError) {
			switch (error.code) {
				case 'P2002':
					console.log('User already exists.')
					break
				default:
					console.log(error)
			}
		}
		return false
	}
	await database.$disconnect()
	return true
}
export { database, initialize }
