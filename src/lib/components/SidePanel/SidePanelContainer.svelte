<script>
	import { setContext } from 'svelte'
	import { slide } from 'svelte/transition'

	let innerWidth = Number()
	let isOpenPanelNav = false
	let availableKangguuds = true

	$: {
		if (innerWidth >= 768) {
			isOpenPanelNav = true
			availableKangguuds = false
		} else {
			isOpenPanelNav = false
			availableKangguuds = true
		}
	}

	function toggleOpenPanelNav() {
		isOpenPanelNav = !isOpenPanelNav
	}

	function closeSidePanelNavForItems() {
		isOpenPanelNav = availableKangguuds ? false : true
	}

	setContext('close', closeSidePanelNavForItems)
</script>

<svelte:window bind:innerWidth />
<div class="side-panel">
	<div class="nav">
		<div class="header">
			<slot name="header" />
			{#if availableKangguuds}
				<button on:click={toggleOpenPanelNav}>
					{#if isOpenPanelNav}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 9h16.5m-16.5 6.75h16.5"
							/>
						</svg>
					{/if}
				</button>
			{/if}
		</div>
		{#if isOpenPanelNav}
			<div class="nav-items" transition:slide>
				<slot name="nav-items" />
			</div>
		{/if}
	</div>

	<div class="body">
		<slot name="body" />
	</div>
</div>

<style lang="postcss">
	.side-panel {
		@apply grid md:grid-cols-3 grid-cols-1 gap-8;
	}

	.nav {
		@apply flex flex-col relative;
	}

	.header {
		@apply flex justify-between;
	}
	.nav-items {
		@apply grid
        gap-y-4
        max-md:absolute
        w-full
        rounded-md
        max-md:py-2
        max-md:bg-slate-100
        max-md:dark:bg-neutral-800
        max-md:top-14;
	}

	.body {
		@apply md:col-span-2;
	}
</style>
