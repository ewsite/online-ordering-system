<script lang="ts">
	import { Button, Input } from '$lib/components'
	import { getContext } from 'svelte'
	import type { Writable } from 'svelte/store'

	const steps: Writable<number> = getContext('steps')
	const errorMessage: Writable<string> = getContext('errorMessage')
	const _data: Writable<Map<any, any>> = getContext('data')
	/**
	 * @type {Number}
	 */
	let age = $_data.get('age') as number

	function check() {
		if (age < 18) {
			$errorMessage = 'Age under 18 is not allowed to use this service.'
			return
		}
		$_data.set('age', age)
		$steps++
	}
</script>

<div class="flex flex-col space-y-4">
	<p>Tell us your age first.</p>
	<Input type="number" bind:value={age} placeholder="Age" required>Age</Input>
	<Button preventDefault on:click={check}>Next</Button>
</div>
