import { formCheck } from './tools/Integrity';
import images from './images';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
class products {
	/**
	 * @param {import('@prisma/client').PrismaClient} db
	 */
	constructor(db) {
		this.db = db;
	}

	/**
	 * @param {{name: string  | FormDataEntryValue, description: string | FormDataEntryValue, price: Number | FormDataEntryValue, images: File | FormDataEntryValue}} data
	 */
	async add(data) {
		const schema = {
			name: 'string',
			description: 'string',
			price: 'number'
		};

		/**
		 * @type {import('@prisma/client').Products}
		 */
		if (!formCheck(data, schema)) throw ERROR.D0001;

		// Make sure that no special characters are allowed in url_name
		// Also, spaces is also replaced to slash.
		const reg1 = RegExp(/[^\w\s]/gi);
		const reg2 = RegExp(/[\s]/gi);
		const rmSpecChar = String(data.name).replace(reg1, '');
		const url_name = rmSpecChar.replace(reg2, '-').toLowerCase();

		// Assign image saving paths
		const productDirPath = `products/${url_name}`;

		try {
			/**
			 * @type {ArrayBuffer}
			 */
			const imageBuffer = await data.images.arrayBuffer();

			// It's time to resize the image.
			// Rodel needs at least 3 image sizes to give rodel more options
			// to use these images to speed up page loading times.
			// These 3 instances need to be saved first as buffer to work on saving images as a file.
			const inputInstance = new images(imageBuffer);

			await inputInstance.resize();

			let instanceStatus = await inputInstance.save(productDirPath, 'sample1');
			if (!instanceStatus) {
				throw ERROR.FS001;
			}

			// Add new Product to the database
			await this.db.products.create({
				data: {
					name: String(data.name),
					url_name: url_name,
					description: String(data.description),
					price: Number(data.price)
				}
			});
		} catch (error) {
			await this.db.$disconnect();
			// Error occurs when the username already exists in the database
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error?.code) {
					case 'P2002':
						throw ERROR.P2002;
				}
			}
			console.error(error);
			return;
		}
		await this.db.$disconnect();

		return true;
	}

	/**
	 * @param {String | Number | FormDataEntryValue | null} identifier
	 */
	async get(identifier) {
		let data;

		if (!identifier) throw ERROR.D0001;

		const where = Number.isInteger(identifier)
			? { id: Number(identifier) }
			: { url_name: String(identifier) };

		try {
			data = await this.db.products.findUnique({ where: where });
		} catch (error) {
			await this.db.$disconnect();
			console.error(error);
			return;
		}
		await this.db.$disconnect();
		return data;
	}

	async getAll() {
		let data;
		try {
			data = await this.db.products.findMany({
				orderBy: {
					createdAt: 'desc'
				}
			});
		} catch (error) {
			this.db.$disconnect();
			console.error(error);
			return;
		}
		this.db.$disconnect();
		return data;
	}
}
const ERROR = {
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
	}
};
export default products;
