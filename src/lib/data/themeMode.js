import { writable } from 'svelte/store';

const allowedMode = ['dark', 'light'];

function themeModeStore() {
	const { subscribe, set } = writable(null);

	function change(choosedMode) {
		if (!allowedMode.includes(choosedMode)) return false;

		localStorage.theme = choosedMode;
		set(choosedMode);

		for (const mode of allowedMode) document.documentElement.classList.remove(mode);

		document.documentElement.classList.add(choosedMode);
		return true;
	}
	function initialize() {
		if (
			localStorage.theme == 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			return change('dark');
		} else {
			return change('light');
		}
	}
	function toggle() {
		change(localStorage.theme == 'dark' ? 'light' : 'dark');
	}

	return {
		subscribe,
		toggle,
		change,
		initialize
	};
}

const themeMode = themeModeStore();
// eslint-disable-next-line no-undef
export default themeMode;
