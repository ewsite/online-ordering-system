<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition'
	import { Button } from '../components'
	import { navigating } from '$app/stores'
	import type themeMode from '$lib/data/themeMode'

	export let themeModeToggler: typeof themeMode
	export let userInfo: App.Locals
	export let navigations = [
		{ name: 'Home', href: '/' },
		{ name: 'Shop', href: '/shop' }
	]

	const userActionsLists = [
		{ name: 'Dashboard', href: '/dashboard' },
		{ name: 'Settings', href: '/settings' },
		{ name: 'Log Out', href: '/logout' }
	]

	let openSidebar: boolean = false
	let isOpenUserActions: boolean = true

	function navigationToggle(): void {
		isOpenUserActions = false
		openSidebar = !openSidebar
	}

	function forceCloseUserActions(): void {
		isOpenUserActions = false
	}

	function userActionsToggle(): void {
		isOpenUserActions = !isOpenUserActions
	}

	$: {
		$navigating
		isOpenUserActions = false
	}
</script>

<header>
	<nav>
		<div class="icon">
			<button class="toggle" on:click={navigationToggle}>
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
			</button>
			<a href="/" class="flex space-x-2 items-center">
				<img src="/favicon-192x192.png" class="h-8 aspect-square" alt="" />
				<b>Vape</b>
			</a>
		</div>
		<div class="menu" role="menu">
			{#each navigations as { href, name }}
				<a class="menu-nav" {href}>
					{name}
				</a>
			{/each}
		</div>
		<div class="quickaccess space-x-4">
			<button
				class="thememode-toggle qa-menu-nav"
				on:click={() => themeModeToggler.toggle()}
			>
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

			<div class="user-actions">
				{#if userInfo?.loggedIn}
					<Button color="primary-invert" on:click={userActionsToggle}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2.5"
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
					{#if isOpenUserActions}
						<ul class="ua-nav" transition:slide>
							<li class="ua-nav-item">
								<h6 class="m-0">{userInfo?.username}</h6>
							</li>
							<li class="ua-nav-item">
								<b>Quick Actions</b>
							</li>
							{#each userActionsLists as { name, href }}
								<li class="ua-nav-item">
									<a {href}>{name}</a>
								</li>
							{/each}
						</ul>
					{/if}
				{:else}
					<Button color="primary-invert" type="link" href="/login">
						<b>Log In</b>
					</Button>
				{/if}
			</div>
			<a href="/cart" class="qa-menu-nav">
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
						d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
					/>
				</svg>
			</a>
		</div>
	</nav>
</header>
{#if openSidebar}
	<aside in:fly={{ x: -100 }} out:fly={{ x: -100 }}>
		<div class="aside-header">
			<button on:click={() => (openSidebar = false)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<h5 class="m-0">Menu</h5>
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
		<div class="aside-footer">
			{#if isOpenUserActions}
				<button
					class="aua-overlay"
					transition:fade={{ duration: 100 }}
					on:click={forceCloseUserActions}
				/>
			{/if}
			<div class="aside-user-actions">
				{#if userInfo?.loggedIn}
					<Button color="primary" on:click={userActionsToggle}>
						<div class="aua-toggle">
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
							<b>{userInfo?.username}</b>
						</div>
					</Button>
				{:else}
					<Button color="primary-invert" type="link" href="/login">
						<b>Log In</b>
					</Button>
				{/if}

				{#if isOpenUserActions}
					<ul class="aua-nav" transition:fade={{ duration: 150 }}>
						{#each userActionsLists as { name, href }}
							<li class="aua-nav-item">
								<a {href} on:click={userActionsToggle}>{name}</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
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
	nav {
		@apply px-4
        py-2
        xl:container
        mx-auto
        flex
        justify-between
        items-center
        h-full;
	}
	.icon {
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
	.menu {
		@apply md:flex
        hidden
        list-none
        space-x-4
		py-2;
	}

	.menu-nav {
		@apply w-24 text-center;
	}

	.qa-menu-nav,
	.menu-nav {
		@apply bg-opacity-10 backdrop-blur-md dark:bg-opacity-10 px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 dark:hover:bg-neutral-700 transition dark:bg-neutral-800 font-bold;
	}
	.quickaccess {
		@apply flex
        items-center
		justify-center;
	}
	aside {
		z-index: 100;
		@apply fixed
		flex
		flex-col
        top-0
        bg-slate-100
        h-screen
        w-full
        dark:bg-neutral-900;
	}

	.aside-header {
		@apply p-4
        flex
        items-center
        space-x-4;
	}

	.aside-body {
		@apply mx-4 grow flex items-center;
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

	.aside-footer {
		@apply w-full p-3;
	}

	/* User action in desktop mode */
	.user-actions {
		@apply relative max-md:hidden md:block;
	}
	.ua-nav {
		@apply absolute top-full right-0 mt-4 w-64 list-none ps-0 bg-slate-100 dark:bg-neutral-800 rounded;
	}
	.ua-nav-item {
		@apply px-4 p-3 w-full;
	}
	.ua-nav-item > * {
		@apply w-full h-full block;
	}

	/* User action in mobile mode */
	.aside-user-actions {
		@apply max-md:flex flex-col relative;
	}
	.aua-toggle {
		@apply flex space-x-2;
	}
	.aua-overlay {
		@apply fixed h-screen w-screen top-0 left-0 backdrop-blur-md;
	}
	.aua-nav {
		@apply rounded list-none mb-4 p-0 bg-slate-50 absolute bottom-full font-bold w-full;
	}

	.aua-nav-item {
		@apply w-full bg-neutral-800;
	}
	.aua-nav-item > a {
		@apply w-full h-full block;
	}

	.aua-nav-item > a {
		@apply hover:bg-slate-200 dark:hover:bg-neutral-700 px-4 py-3;
	}
</style>
