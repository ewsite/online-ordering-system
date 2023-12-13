<script context="module">
	const steps = writable(0)
	const errorMessage = writable(null)
	const _data = writable(new Map())
</script>

<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { slide } from 'svelte/transition'
	import type { PageData } from './$types'

	export let data: PageData
	const stepsEndpoint = ['/confirm-age', '/auth', '/profile', '/accept']

	setContext('steps', steps)
	setContext('errorMessage', errorMessage)
	setContext('data', _data)
	$: {
		if ($steps != stepsEndpoint.length) {
			if ($steps > 0) {
				goto('/register' + stepsEndpoint[$steps], { replaceState: true })
				$errorMessage = null
			}
		} else {
			$steps = 0
			$_data = new Map()
		}
	}
	function backSteps() {
		if (!$steps) goto('/login', { replaceState: true })
	}
</script>

<svelte:head>
	<title>Register - {data.meta.title}</title>
</svelte:head>

<div class="space-y-4">
	<div class="flex align-center space-x-4">
		<button on:click={backSteps}>
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
					d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
				/>
			</svg>
		</button>
		<h3 class="m-0">Register</h3>
	</div>

	<p>Please register to continue.</p>
	{#if $errorMessage}
		<div class="bg-rose-600 rounded p-2 text-slate-50" transition:slide>
			{$errorMessage}
		</div>
	{/if}
</div>

<form
	method="POST"
	action="/register?/register"
	use:enhance={async ({ formData }) => {
		for (const d of $_data.keys()) {
			formData.set(d, $_data.get(d))
		}
		return async () => {
			await goto('/login', { replaceState: true })
			$steps++
		}
	}}
>
	<div>
		<slot />
	</div>
</form>
<div class="text-slate-400">
	<p>Any questions? Click <a href="/dumped">here</a></p>
</div>
