<script lang="ts">
	import { Button, Input } from '$lib/components'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	const steps: Writable<number> = getContext('steps')
	const errorMessage: Writable<string> = getContext('errorMessage')
	const _data: Writable<Map<any, any>> = getContext('data')

	let firstName = $_data.get('firstName') as string
	let lastName = $_data.get('lastName') as string

	function check() {
		if (!lastName?.length || !firstName?.length) {
			$errorMessage = 'Please complete the form'
			return
		}
		$_data.set('firstName', firstName)
		$_data.set('lastName', lastName)
		++$steps
	}
</script>

<div class="flex flex-col space-y-4">
	<p>Profile Information</p>
	<Input type="text" bind:value={firstName} required placeholder="First Name"
		>First Name</Input
	>
	<Input type="text" bind:value={lastName} required placeholder="Last Name"
		>Last Name</Input
	>
	<Button preventDefault on:click={check}>Next</Button>
</div>
