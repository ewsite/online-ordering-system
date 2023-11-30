module.exports = {
	root: true,
	extends: ['plugin:svelte/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: {
					// Specify a parser for each lang.
					ts: '@typescript-eslint/parser',
					js: 'espree',
					typescript: '@typescript-eslint/parser'
				}
			}
		}
	],
	env: {
		browser: true,
		es2017: true,
		node: true
	}
}
