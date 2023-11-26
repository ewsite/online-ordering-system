import { database, initialize } from '$lib/database';
import productLists from '$lib/data/productLists.json';
import { readFileSync } from 'fs';
import products from '$lib/products';
/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const productInstance = new products(database);
	await initialize();

	try {
		const ables = readFileSync('src/lib/data/prototype.jpg');
		let imageBufferasFile = new File([ables], 'proto.jpg', { type: 'image/jpg' });
		// // Simulation: Adding products
		for (const { name, description, price } of productLists) {
			await productInstance.add({ name, description, price, images: imageBufferasFile });
		}
	} catch (e) {
		console.log(e);
	}
	await database.$disconnect();
}
