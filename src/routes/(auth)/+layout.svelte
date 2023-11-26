<script>
	import { fly, fade } from 'svelte/transition';
	import { navigating } from '$app/stores';
	import { onDestroy } from 'svelte';
	import redirectStores from '$lib/stores/redirectStores.js';
	export let data;

	onDestroy(() => {
		$redirectStores = null;
	});
</script>

<div class="auth-container">
	<div class="auth-flyout">
		{#key data?.url}
			<div class="auth-main" in:fly={{ x: 100, delay: 500 }} out:fly={{ x: -100 }}>
				<slot />
			</div>
		{/key}
		{#if $navigating}
			<div class="page-loading" transition:fade={{ duration: 250 }}>
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-16 h-16 animate-spin"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
						/>
					</svg>
				</span>
			</div>
		{/if}
	</div>
	<div class="auth-sidebg" />
</div>

<style lang="postcss">
	.auth-container {
		@apply grid grid-cols-12 w-full h-screen;
	}
	.auth-main {
		@apply w-full flex justify-between h-full flex-col;
	}
	.auth-flyout {
		@apply overflow-x-hidden col-span-11 md:col-span-6 overflow-y-auto flex items-center p-8 relative rounded-md;
	}

	.auth-sidebg {
		background: rgb(190,0,154);
		background: linear-gradient(121deg, rgba(190,0,154,1) 0%, rgba(255,0,86,1) 100%);
		@apply md:col-span-6 rounded-md;
	}

	.page-loading {
		@apply bg-opacity-10
			dark:bg-opacity-10
			backdrop-blur-md 
			bg-slate-100
			dark:bg-neutral-800
			z-10
			absolute
			left-0
			top-0
			w-full
            h-full
            flex
            items-center
            justify-center;
	}
	.page-loading > span {
		@apply p-4
			rounded-lg
			bg-slate-100
			dark:bg-neutral-800
			flex
            flex-col
            justify-center
            items-center;
	}
</style>
