import sharp from 'sharp';
import { writeFile, mkdir, access, constants, rmdir, unlink } from 'fs/promises';
class images {
	/**
	 * @param {Buffer | ArrayBuffer} imageBuffer
	 */
	constructor(imageBuffer) {
		this.instance = sharp(imageBuffer);
		/**
		 * @type {{original: Buffer?, medium: Buffer?, small: Buffer?}}
		 */
		this.resizedBuffers = {
			original: null,
			medium: null,
			small: null
		};
	}

	async resize() {
		const outResizedBuffer = await this.instance
			.resize(1024, null, { kernel: 'lanczos2' })
			.webp({ quality: 75 })
			.toBuffer();

		const outResizedMdBuffer = await this.instance
			.resize(512, null, { kernel: 'lanczos2' })
			.webp({ quality: 75 })
			.toBuffer();

		const outResizedSmBuffer = await this.instance
			.resize(256, null, { kernel: 'lanczos2' })
			.webp({ quality: 75 })
			.toBuffer();

		this.resizedBuffers = {
			original: outResizedBuffer,
			medium: outResizedMdBuffer,
			small: outResizedSmBuffer
		};
	}

	/**
	 *
	 * @param {string} path
	 * @param {string} filename
	 */
	async save(path, filename) {
		const basePath = 'uploads/';
		const filenames = {
			original: `${basePath}${path}${path?.length ? '/' : ''}${filename}.webp`,
			medium: `${basePath}${path}${path?.length ? '/' : ''}${filename}-md.webp`,
			small: `${basePath}${path}${path?.length ? '/' : ''}${filename}-sm.webp`
		};
		if (!this.resizedBuffers.original || !this.resizedBuffers.medium || !this.resizedBuffers.small)
			return false;

		// Check the folder if exists.
		try {
			await access(basePath + path, constants.F_OK);
		} catch (error) {
			// If none, just create a folder
			try {
				await mkdir(basePath + path);
			} catch (err) {
				console.error('[MKDIR]:' + err);
				return;
			}
			// Save 3 resized image buffers to the folder as a file.
			try {
				await writeFile(filenames.original, this.resizedBuffers?.original);
				await writeFile(filenames.medium, this.resizedBuffers?.original);
				await writeFile(filenames.small, this.resizedBuffers?.original);
			} catch (err) {
				console.error('[WRITEFILE]' + err);
				return false;
			}

			// Delete the folder and its contents if it's incomplete.
			try {
				await access(filenames.original, constants.F_OK);
				await access(filenames.medium, constants.F_OK);
				await access(filenames.small, constants.F_OK);
			} catch (error) {
				try {
					await unlink(filenames.original);
					await unlink(filenames.medium);
					await unlink(filenames.small);
					await rmdir(basePath + path);
				} catch (e) {
					console.log(
						"There's an error occuring on deleting incomplete contents in the folder. Ignore this."
					);
				}
			}
			return true;
		}

		return false;
	}
}

export default images;
