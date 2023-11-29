<script lang="ts">
	import { fly, slide } from 'svelte/transition'
	import { Button } from '../components'
	import { navigating } from '$app/stores'
	import type themeMode from '$lib/data/themeMode'

	export let themeModeToggler: typeof themeMode
	export let userInfo: App.Locals
	export let navigations = [
		{ name: 'Home', href: '/' },
		{ name: 'Shop', href: '/shop' },
		{ name: 'Cart', href: '/cart' }
	]

	let openSidebar: boolean = false
	let openQuickUserMenu: boolean = false

	function navigationToggle(): void {
		openQuickUserMenu = false
		openSidebar = !openSidebar
	}

	function quickUserMenuToggle(): void {
		openSidebar = false
		openQuickUserMenu = !openQuickUserMenu
	}

	$: {
		$navigating
		openQuickUserMenu = false
	}
</script>

<header>
	<div class="header-wrapper" role="navigation">
		<div class="header-logo">
			<button class="toggle" on:click={navigationToggle}>
				{#if openSidebar}
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
			<a href="/" class="flex space-x-2 items-center">
				<img src="/images/favicon_origin.png" class="h-8 aspect-square" alt="" />
				<b>Vape</b>
			</a>
		</div>
		<div class="header-menu" role="menu">
			{#each navigations as { href, name }}
				<a class="header-menu-nav" {href}>
					{name}
				</a>
			{/each}
		</div>
		<div class="header-quickaccess space-x-4">
			<button class="thememode-toggle" on:click={() => themeModeToggler.toggle()}>
				{#if $themeModeToggler == 'light'}
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
							d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
						/>
					</svg>
					<b>Light</b>
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
							d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
						/>
					</svg>
					<b>Dark</b>
				{/if}
			</button>

			<div>
				{#if userInfo?.loggedIn}
					<div class="quick-user">
						<Button color="primary-invert" on:click={quickUserMenuToggle}>
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
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								/>
							</svg>
						</Button>
						{#if openQuickUserMenu}
							<div class="quick-user-menu" transition:slide>
								<h6 class="ps-2">{userInfo?.username}</h6>
								<b>Quick Actions</b>
								<a href="/dashboard">Dashboard</a>
								<a href="/settings">Settings</a>
								<a href="/logout">Logout</a>
							</div>
						{/if}
					</div>
				{:else}
					<Button color="primary-invert" type="link" href="/login">
						<b>Log In</b>
					</Button>
				{/if}
			</div>
		</div>
	</div>
</header>
{#if openSidebar}
	<aside in:fly={{ x: -100 }} out:fly={{ x: -100 }}>
		<div class="aside-header">
			<h5>Menu</h5>
		</div>
		<div class="aside-body" role="navigation">
			<span class="aside-menu" role="menu">
				{#each navigations as { name, href }}
					<a role="menuitem" {href} on:click={navigationToggle}>
						{name}
					</a>
				{/each}
			</span>
		</div>
	</aside>
{/if}

<style lang="postcss">
	header {
		z-index: 50;
		@apply fixed
        w-full
        top-0
        z-50
        h-14
        backdrop-blur-sm;
	}
	.header-wrapper {
		@apply px-4
        py-2
        xl:container
        mx-auto
        flex
        justify-between
        items-center
        h-full;
	}
	.header-logo {
		@apply flex
        items-center
		space-x-4;
	}
	.toggle,
	.thememode-toggle {
		@apply flex
        items-center;
	}
	.thememode-toggle {
		@apply space-x-2;
	}
	.toggle {
		@apply md:hidden;
	}
	.header-menu {
		@apply md:flex
        hidden
        list-none
        space-x-4
		py-2;
	}

	.header-menu-nav {
		@apply bg-opacity-10 backdrop-blur-md dark:bg-opacity-10 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 dark:hover:bg-neutral-700 transition dark:bg-neutral-800 font-bold w-24 text-center;
	}
	.header-quickaccess {
		@apply flex
        items-center;
	}
	aside {
		z-index: 49;
		@apply fixed
        top-0
        bg-slate-100
        h-screen
        w-full
        dark:bg-neutral-900;
	}

	.aside-header {
		@apply mt-14
        p-4
        flex
        items-center
        justify-between;
	}

	.aside-body {
		@apply mx-4;
	}
	.aside-menu {
		@apply flex
        flex-col
        space-y-4;
	}
	.aside-menu > * {
		@apply py-2
		font-bold
        rounded
		text-5xl
        flex
		transition
		hover:text-neutral-700
		dark:hover:text-slate-200;
	}

	.quick-user {
		@apply relative;
	}
	.quick-user-menu {
		@apply text-right
        w-48
        shadow-lg
        bg-slate-100
        dark:bg-neutral-800
        py-2
        px-2
        rounded-md
        absolute
        right-0
        mt-2
        bg-opacity-95;
	}

	.quick-user-menu > * {
		@apply w-full block text-left py-2 transition px-4 rounded;
	}
	.quick-user-menu > a {
		@apply hover:bg-slate-200 hover:dark:bg-neutral-700;
	}
</style>
