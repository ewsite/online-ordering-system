<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svelte:head>
	<title>Dashboard - {data.meta.title}</title>
</svelte:head>
<div class="space-y-4">
	{#if data.profile}
		<h3>Hi, {data.profile.firstName} {data.profile.lastName}!</h3>
		<hr />
		<p><b>Profile ID: </b>{data.profile.id}</p>
		<br />
	{/if}
	<div class="box-summary">
		{#if data.orders?.length}
			<a class="box-item success" href="/dashboard/order">
				<h5 class="m-0">Orders</h5>
				<p>You actually ordered our products to our shop. Thank you!.</p>
				<b>Click here to see your orders.</b>
			</a>
		{:else}
			<a class="box-item needsaction" href="/shop">
				<h5 class="m-0">Orders</h5>
				<p>You can order our products by clicking here.</p>
			</a>
		{/if}
		<a class="box-item alarming" href="/settings/address">
			<h5 class="m-0">Shipping Address</h5>
			<p>
				Before checkout, you must have at least one shipping address to ship our products
				to your doorstep.
			</p>
		</a>
	</div>
</div>

<style lang="postcss">
	.box-summary {
		@apply grid grid-cols-1 md:grid-cols-3 gap-4;
	}

	.box-item {
		@apply py-3 px-4 rounded shadow-md flex flex-col;
	}

	.box-item.success {
		@apply dark:bg-opacity-10 dark:bg-green-500 dark:text-green-500 bg-green-500 text-slate-50;
	}

	.box-item.needsaction {
		@apply dark:bg-opacity-10 dark:bg-yellow-500 dark:text-yellow-500 bg-yellow-500 text-slate-50;
	}

	.box-item.alarming {
		@apply dark:bg-opacity-10 dark:bg-red-500 dark:text-red-500 bg-red-500 text-slate-50;
	}
</style>
