<script>
	import { setContext } from 'svelte'

	export let forceOneRow = false
	export let addExtraActions = false

	$: setContext('addExtraActions', addExtraActions)
</script>

<div class="items-box-container" class:wacked={forceOneRow}>
	<slot />
</div>

<style lang="postcss">
	.items-box-container {
		@apply grid grid-cols-1 gap-4;
	}
	.items-box-container:not(.wacked) {
		@apply md:grid-cols-2;
	}
</style>
