import bcrypt from 'bcryptjs'
const password = {
	hash: (plainPasswordText: string): string => {
		return bcrypt.hashSync(plainPasswordText, 10)
	},
	verify: async (
		plainPasswordText: string,
		passwordFromHash: string
	): Promise<boolean> => {
		return await bcrypt.compare(plainPasswordText, passwordFromHash)
	}
}

export default password
