<script context="module">
	import { writable } from 'svelte/store';

	const activeDropdown = writable(null);
	const dropdowns = writable(0);
</script>

<script>
	import { themeColors } from '$lib/config/theme';
	import { setContext } from 'svelte';

	const dropdownID = $dropdowns++;

	export let color = '';
	export let open = false;

	function toggleDropdown() {
		open = !open;
		if (open) {
			$activeDropdown = dropdownID;
		}
	}

	setContext('toggle', toggleDropdown);
	$: color = themeColors.verify(color, true) ? color : themeColors.getDefault();

	$: {
		if ($activeDropdown !== dropdownID) {
			open = false;
		}
	}
</script>

<div class="dropdown">
	<button class={`${color}`} on:click={toggleDropdown}>
		<b>
			<slot name="title">Dropdown</slot>
		</b>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-6 h-6"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
		</svg>
	</button>

	{#if open}
		<ul>
			<slot />
		</ul>
	{/if}
</div>

<style lang="postcss">
	div {
		@apply relative
        space-y-4;
	}
	button {
		@apply rounded
        px-4
        py-2
        text-slate-50
        w-full
        flex
        justify-between
        space-x-4;
	}

	ul {
		z-index: 20;
		@apply p-0
        rounded
        w-full
        absolute
        bg-slate-200
        dark:bg-neutral-800
        backdrop-blur-sm
        flex
        flex-col
        max-h-64
        overflow-y-auto
        overflow-x-hidden;
	}
	/* Colors -- Default Version */

	button.primary {
		@apply bg-blue-500;
	}

	button.secondary {
		@apply bg-violet-500;
	}

	button.warning {
		@apply bg-yellow-400;
	}

	button.success {
		@apply bg-green-500;
	}

	button.error {
		@apply bg-red-500;
	}
</style>
