<script>
	import { getContext } from 'svelte'

	/**
	 * @type {string}
	 */
	export let href

	/**
	 * @type {boolean}
	 */
	export let active = false
	let closeSidePanelNavForItems = getContext('close')
</script>

<a {href} class:active on:click={closeSidePanelNavForItems}><slot /></a>

<style lang="postcss">
	a {
		@apply transition
        max-md:px-3
        py-2;
	}

	.active {
		@apply text-rose-600
        font-bold;
	}
</style>
