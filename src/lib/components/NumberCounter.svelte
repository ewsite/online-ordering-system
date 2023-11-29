<script>
	export let id = String()
	export let name = String()
	export let required = false
	export let min = 0
	export let max = 100
	/**
	 * @type {number | null}
	 */
	export let value = null
	/**
	 *
	 * @param {Event} event
	 */
	function subtract(event) {
		if (value === null) return
		value = value === min ? max : value - 1
	}

	function add() {
		if (value === null) return
		value = value === max ? min : value + 1
	}
</script>

<div class="">
	<button on:click|preventDefault={subtract}>-</button>
	<input type="number" bind:value id={id || null} {name} {required} />
	<button on:click|preventDefault={add}>+</button>
</div>

<style lang="postcss">
	input {
		@apply w-full
            px-2
            py-2
            bg-transparent
            grow
            bg-slate-200
            dark:bg-opacity-10
            rounded
            text-center
            font-bold;
	}

	input:focus {
		@apply outline-none;
	}

	button {
		@apply h-full aspect-square rounded-lg font-bold text-lg;
	}

	button {
		@apply bg-rose-600 text-slate-50 hover:bg-rose-700;
	}
	div {
		@apply relative
            p-0.5
            border-2
            border-transparent
            flex
            items-center
            outline-2
            space-x-2;
	}
</style>
