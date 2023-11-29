import images from './images'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { TypeError } from './types'
import type { PrismaClient } from '@prisma/client'

export type ProductInfo = {
	name: string
	description: string
	price: number
	images: File
}

class products {
	constructor(public db: PrismaClient) {}

	async add(info: ProductInfo): Promise<boolean> {
		// Make sure that no special characters are allowed in url_name
		// Also, spaces is also replaced to slash.
		const reg1 = RegExp(/[^\w\s]/gi)
		const reg2 = RegExp(/[\s]/gi)
		const rmSpecChar = String(info.name).replace(reg1, '')
		const url_name = rmSpecChar.replace(reg2, '-').toLowerCase()

		// Assign image saving paths
		const productDirPath = `products/${url_name}`

		try {
			/**
			 * @type {ArrayBuffer}
			 */
			const imageBuffer = await info.images.arrayBuffer()

			// It's time to resize the image.
			// Rodel needs at least 3 image sizes to give rodel more options
			// to use these images to speed up page loading times.
			// These 3 instances need to be saved first as buffer to work on saving images as a file.
			const inputInstance = new images(imageBuffer)

			await inputInstance.resize()

			const instanceStatus = await inputInstance.save(productDirPath, 'sample1')

			if (!instanceStatus) {
				throw ERROR.FS001
			}

			// Add new Product to the database
			await this.db.products.create({
				data: {
					name: info.name,
					url_name: url_name,
					description: info.description,
					price: info.price
				}
			})
		} catch (error) {
			await this.db.$disconnect()
			// Error occurs when the username already exists in the database
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2002':
						throw ERROR.P2002
				}
			}
			console.error(error)
			throw ERROR.MXXX
		}
		await this.db.$disconnect()

		return true
	}

	async get(idOrUrl: string | number) {
		let data

		if (!idOrUrl) throw ERROR.D0001

		const where = Number.isInteger(idOrUrl)
			? { id: Number(idOrUrl) }
			: { url_name: String(idOrUrl) }

		try {
			data = await this.db.products.findUnique({ where: where })
		} catch (error) {
			await this.db.$disconnect()
			console.error(error)
			throw ERROR.MXXX
		}
		await this.db.$disconnect()
		return data
	}

	async getAll() {
		let data
		try {
			data = await this.db.products.findMany({
				orderBy: {
					createdAt: 'desc'
				}
			})
		} catch (error) {
			this.db.$disconnect()
			console.error(error)
			throw ERROR.MXXX
		}
		this.db.$disconnect()
		return data
	}
}
const ERROR: TypeError = {
	P2002: {
		code: 'PRODUCT_ALREADY_EXISTS',
		message: 'This product already exists.'
	},

	D0001: {
		code: 'DATA_INVALID',
		message: 'Invalid Data.'
	},
	FS001: {
		code: 'FS_URLNAME_ALREADY_EXISTS',
		message:
			'Your product name does have existing product name (deleted or not). Please change a different product name.'
	},
	MXXX: {
		code: 'UNKNOWN',
		message: 'Unknown Error.'
	}
}
export default products
