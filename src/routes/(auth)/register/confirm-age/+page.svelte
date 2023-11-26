<script>
	import { Button, Input } from '$lib/components';
	import { getContext } from 'svelte';
	import { writable } from 'svelte/store';

	writable;

	const steps = getContext('steps');
	const errorMessage = getContext('errorMessage');
	/**
	 * @type {import('svelte/store').Writable<Map<any, any>>}
	 */
	const _data = getContext('data');

	/**
	 * @type {Number}
	 */
	let age = $_data.get('age');

	function check() {
		if (age < 18) {
			$errorMessage = 'Age under 18 is not allowed to use this service.';
			return;
		}
		$_data.set('age', age);
		$steps++;
	}
</script>

<div class="flex flex-col space-y-4">
	<p>Tell us your age first.</p>
	<Input type="number" bind:value={age} placeholder="Age" required>Age</Input>
	<Button preventDefault on:click={check}>Next</Button>
</div>
