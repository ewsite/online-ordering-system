<script lang="ts">
	import { Navigation, Footer } from '$lib/layouts'
	import themeMode from '$lib/data/themeMode'
	import { onMount } from 'svelte'
	import { navigating } from '$app/stores'
	import { fade } from 'svelte/transition'
	export let data
	let mounted = false

	onMount(() => (mounted = themeMode.initialize()))
</script>

{#if mounted}
	<Navigation themeModeToggler={themeMode} userInfo={data.userInfo} />
	<div>
		<slot />
	</div>
	<Footer />
{/if}
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

<style lang="postcss">
	.page-loading {
		@apply bg-opacity-10
			dark:bg-opacity-10
			backdrop-blur-md 
			bg-slate-100
			dark:bg-neutral-800
			z-10
			fixed
			top-0
			left-0
			w-screen
            h-screen
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
	div:not(.page-loading) {
		@apply overflow-x-hidden relative;
	}
</style>
