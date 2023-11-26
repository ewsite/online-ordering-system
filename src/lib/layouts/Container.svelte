<script>
	import { onMount } from 'svelte';
	// import themeMode from '$lib/data/themeMode';
	export let className = String();
	export let heading = false; // Deprecated... almost
	export let fullscreen = false;
	// export let backgroundImage = String();
	// export let darkBackgroundImage = String();
	export let itemsToCenter = false;
	let styles = String();

	export { styles as style }
	/**
	 * @type {HTMLElement}
	 */
	let container;
	onMount(() => {
		container.style.backgroundSize = 'cover';
		container.style.backgroundRepeat = 'no-repeat';
		container.style.backgroundPosition = 'center';
	});

	// $: {
	// 	if (container)
	// 		container.style.backgroundImage =
	// 			$themeMode == 'dark'
	// 				? `url("${darkBackgroundImage?.length ? darkBackgroundImage : backgroundImage}")`
	// 				: `url("${backgroundImage}")`;
	// }
</script>

<section class:yunjin={heading} class:nilou={fullscreen} class={className}>
	<div bind:this={container}  style={ styles }  class:ayaka={itemsToCenter}>
		<slot />
	</div>
</section>

<style lang="postcss">
	section {
		@apply px-4
			rounded-lg
			overflow-x-hidden
			pb-8
			xl:container
			mx-auto
			min-h-screen
			flex;
	}

	section.yunjin {
		@apply pt-16;
	}

	section:not(.yunjin) {
		@apply pt-4;
	}

	div {
		@apply px-3
		py-4
		rounded-xl
		shadow-md
		grow
		overflow-x-hidden;
	}

	div.ayaka {
		@apply flex
			items-center
			justify-center;
	}
</style>
