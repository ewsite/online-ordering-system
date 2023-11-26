import availableColors from './colors.json';

export const themeColors = {
	defaultColor: availableColors.default[0],

	setDefault: function (/** @type {string} */ colorToDefault, /** @type {boolean} */ isInvert) {
		const colors = isInvert
			? [...availableColors.default, ...availableColors.invert]
			: availableColors.default;
		this.defaultColor =
			colors.find((availableColor) => availableColor === colorToDefault) || this.defaultColor;
	},

	getDefault: function () {
		return this.defaultColor;
	},

	verify: function (/** @type {string} */ matchColor, /** @type {boolean} */ isInvert) {
		const colors = isInvert
			? [...availableColors.default, ...availableColors.invert]
			: availableColors.default;
		return colors.includes(matchColor);
	}
};
