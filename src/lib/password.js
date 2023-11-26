import bcrypt from 'bcryptjs';
const password = {
	/** @param {string} plainPasswordText **/
	hash: (plainPasswordText) => {
		return bcrypt.hashSync(plainPasswordText, 10);
	},
	/**
	 * @param {string} plainPasswordText
	 * @param {string} passwordFromHash
	 */
	verify: async (plainPasswordText, passwordFromHash) => {
		const match = await bcrypt.compare(plainPasswordText, passwordFromHash);
		return match;
	}
};

export default password;
