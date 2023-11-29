<script lang="ts">
	import { Orders } from '$lib/layouts'
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'

	const RELOAD_DURATION = 5000
	export let data
	onMount(async () => {
		await invalidate('dashboard:reload')
		setInterval(async () => await invalidate('dashboard:reload'), RELOAD_DURATION)
	})
</script>

<h3>My Orders</h3>
<div class="cart-container">
	{#if data?.orders?.length}
		{#each data.orders as { orderStatus, products, id }}
			<div class="cart-item">
				<form method="POST" use:enhance>
					<Orders status={orderStatus} {products} orderId={id} />
				</form>
			</div>
		{/each}
	{:else}
		<b class="text-3xl text-center">No Orders</b>
	{/if}
</div>

<style lang="postcss">
	.cart-container {
		@apply space-y-4;
	}

	.cart-item {
		@apply dark:bg-neutral-800 bg-slate-100 p-2 rounded-md;
	}
</style>
