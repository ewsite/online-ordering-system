<script>
	import { getContext } from 'svelte'
	export let href = ''
	const toggleDropdown = getContext('toggle')
</script>

<li>
	{#if href.length}
		<a on:click={toggleDropdown} {href}>
			<slot />
		</a>
	{:else}
		<button on:click={toggleDropdown}>
			<slot />
		</button>
	{/if}
</li>

<style lang="postcss">
	a,
	button {
		@apply hover:dark:text-neutral-950
            px-4
            py-2
            hover:bg-slate-300
            w-full
            h-full
            text-left;
	}
	li {
		@apply list-none;
	}
</style>
