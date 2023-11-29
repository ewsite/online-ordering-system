<script>
	import { fly } from 'svelte/transition'

	export let enable = false

	let timeoutHandler
	$: {
		if (enable) {
			clearTimeout(timeoutHandler)
			timeoutHandler = setTimeout(() => (enable = false), 5000)
		}
	}
</script>

{#if enable}
	<div class="reminder-container" in:fly={{ y: 100 }} out:fly={{ y: 100 }}>
		<div class="reminder-item">
			<slot />
		</div>
	</div>
{/if}

<style lang="postcss">
	.reminder-container {
		@apply fixed z-50 bottom-0 flex justify-center w-full;
	}
	.reminder-item {
		@apply px-4 py-3 rounded-md shadow-sm bg-slate-100 dark:bg-neutral-800 mb-4;
	}
</style>
