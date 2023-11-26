<script>
	import { Input, Button } from '$lib/components';
	import { enhance } from '$app/forms';
	import redirectStores from '$lib/stores/redirectStores.js';
	import { goto } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';

	export let data;

	let errorMessage = String();
	let processing = false;

	if (data.redirect) {
		$redirectStores = data.redirect;
	}
</script>

<div class="space-y-4">
	<div class="flex align-center space-x-4">
		<button on:click={() => history.back()}>
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
		<h3 class="m-0">Log In</h3>
	</div>
	<p>Please login to continue.</p>
</div>
<form
	method="POST"
	use:enhance={() => {
		processing = true;
		return async ({ result }) => {
			processing = false;
			if (result.type === 'failure') {
				errorMessage = result?.data?.body?.message;
				return;
			}

			await goto($redirectStores ? $redirectStores : '/', {
				replaceState: true,
				invalidateAll: true
			});
		};
	}}
>
	<div class="space-y-4">
		{#if errorMessage.length}
			<div class="space-y-4" transition:fly>
				<div class="rounded bg-red-600 text-slate-50 px-4 py-3">
					<b>{errorMessage}</b>
				</div>
			</div>
		{/if}
		<div class="relative space-y-4">
			<div class="flex flex-col space-y-4">
				<Input name="username" required placeholder="Username">Username</Input>
				<Input name="password" required placeholder="Password" type="password">Password</Input>
			</div>
			<div class="flex flex-col space-y-4">
				<Button type="submit" formaction="?/login">
					<div class="flex justify-center items-center space-x-4">
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
						<p class="m-0 transition-all">{processing ? 'Logging In' : 'Log In'}</p>
					</div>
				</Button>
				<Button color="primary-invert" type="link" href="/register">Register</Button>
			</div>
		</div>
	</div>
</form>
<div class="text-slate-400">
	<p>Forgot Password? <a class="text-red-600" href="/dumped">Coming Soon</a></p>
</div>
