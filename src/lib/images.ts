import sharp from 'sharp'
import { writeFile, mkdir, access, constants, rmdir, unlink } from 'fs/promises'

const IMG_EXTENSION = 'webp'

type OutputResizedBuffers = {
	origin: Buffer | null
	medium: Buffer | null
	small: Buffer | null
}

class images {
	instance: sharp.Sharp
	resizedBuffers: OutputResizedBuffers

	constructor(imageBuffer: Buffer | ArrayBuffer) {
		this.instance = sharp(imageBuffer)
		this.resizedBuffers = {
			origin: null,
			medium: null,
			small: null
		}
	}

	async resize(): Promise<boolean> {
		this.resizedBuffers.origin = await this.instance
			.resize(1024, null, { kernel: 'lanczos2' })
			.webp({ quality: 75 })
			.toBuffer()

		this.resizedBuffers.medium = await this.instance
			.resize(512, null, { kernel: 'lanczos2' })
			.webp({ quality: 75 })
			.toBuffer()

		this.resizedBuffers.small = await this.instance
			.resize(256, null, { kernel: 'lanczos2' })
			.webp({ quality: 75 })
			.toBuffer()

		return true
	}
	
	async save(path: string, filename: string): Promise<boolean> {
		const basePath: string = 'uploads/'
		const targetPath: string = `${basePath}${path}${path?.length ? '/' : ''}`
		const filenames = {
			original: `${targetPath}${filename}.${IMG_EXTENSION}`,
			medium: `${targetPath}${filename}-md.${IMG_EXTENSION}`,
			small: `${targetPath}${path?.length ? '/' : ''}${filename}-sm.${IMG_EXTENSION}`
		}
		if (
			!this.resizedBuffers.origin ||
			!this.resizedBuffers.medium ||
			!this.resizedBuffers.small
		)
			return false

		// Check the folder if exists.
		try {
			await access(`${basePath}${path}`, constants.F_OK)
		} catch (error) {
			// If none, just create a folder
			try {
				await mkdir(`${basePath}${path}`)
			} catch (err) {
				console.error('[MKDIR]:' + err)
				return false
			}
			// Save 3 resized image buffers to the folder as a file.
			try {
				await writeFile(filenames.original, this.resizedBuffers.origin)
				await writeFile(filenames.medium, this.resizedBuffers.medium)
				await writeFile(filenames.small, this.resizedBuffers.small)
			} catch (err) {
				console.error('[WRITEFILE]' + err)
				return false
			}

			// Delete the folder and its contents if it's incomplete.
			try {
				await access(filenames.original, constants.F_OK)
				await access(filenames.medium, constants.F_OK)
				await access(filenames.small, constants.F_OK)
			} catch (error) {
				try {
					await unlink(filenames.original)
					await unlink(filenames.medium)
					await unlink(filenames.small)
					await rmdir(basePath + path)
				} catch (e) {
					console.log(
						"There's an error occuring on deleting incomplete contents in the folder. Ignore this."
					)
				}
			}
			return true
		}

		return false
	}
}

export default images
