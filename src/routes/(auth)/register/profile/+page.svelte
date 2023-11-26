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
	 * @type {String}
	 */
	let firstName = $_data.get('firstName');

	/**
	 * @type {String}
	 */
	let lastName = $_data.get('lastName');

	function check() {
		if (!lastName?.length || !firstName?.length) {
			$errorMessage = 'Please complete the form';
			return;
		}
		$_data.set('firstName', firstName);
		$_data.set('lastName', lastName);
		++$steps;
	}
</script>

<div class="flex flex-col space-y-4">
	<p>Profile Information</p>
	<Input type="text" bind:value={firstName} required placeholder="First Name">First Name</Input>
	<Input type="text" bind:value={lastName} required placeholder="Last Name">Last Name</Input>
	<Button preventDefault on:click={check}>Next</Button>
</div>
