<script>
	import { enhance } from '$app/forms';
	import { Button, Input } from '$lib/components';
	import { getContext } from 'svelte';
	import { fade } from 'svelte/transition';

	const steps = getContext('steps');
	const errorMessage = getContext('errorMessage');
	/**
	 * @type {import('svelte/store').Writable<Map<any, any>>}
	 */
	const _data = getContext('data');

	/**
	 * @type {String}
	 */
	let username = $_data.get('username');

	/**
	 * @type {String}
	 */
	let password = $_data.get('password');

	let processing = false;
	/**
	 *
	 * @type {import('@sveltejs/kit').SubmitFunction}
	 */
	function check({ cancel }) {
		processing = true;
		if (!password?.length || !username?.length) {
			$errorMessage = 'Please fill up the username or password.';
			processing = false;
			cancel();
		}

		if (password?.length < 6) {
			$errorMessage = 'Password must at least 8 characters or more';
			processing = false;
			cancel();
		}
		return async ({ result }) => {
			processing = false;
			if (result.type == 'failure') {
				$errorMessage = result.data?.message;
				return;
			}

			$_data.set('username', username);
			$_data.set('password', password);
			++$steps;
		};
	}
</script>

<form action="?/checkUsername" method="POST" use:enhance={check}>
	<div class="flex flex-col space-y-4">
		<p>Create a username and password.</p>
		<Input name="username" type="text" bind:value={username} required placeholder="Username"
			>Username</Input
		>
		<Input type="password" bind:value={password} required placeholder="Password">Password</Input>
		<Button type="submit">
			<div class="flex space-x-4 justify-center">
				{#if processing}
					<span transition:fade>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6 animate-spin"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
							/>
						</svg>
					</span>
				{/if}
				<p class="m-0 transition-all">{processing ? 'Checking' : 'Next'}</p>
			</div>
		</Button>
	</div>
</form>
