<script lang="ts">
	import { Button } from '$lib/components'
	import { fly } from 'svelte/transition'
	import type { PageData } from './$types'

	export let data: PageData

	const navigationTabs = [
		{ name: 'Await', href: '/dashboard/customer/order/begin_order' },
		{ name: 'Cancelled', href: '/dashboard/customer/order/cancelled' },
		{ name: 'Delivered', href: '/dashboard/customer/order/delivered' }
	]
</script>

<svelte:head>
	<title>{data.customerOrderTitle} - {data.meta.title}</title>
</svelte:head>
<h3>{data.customerOrderTitle}</h3>

<div class="tabs">
	<div class="header space-x-2">
		{#each navigationTabs as { name, href }}
			<Button
				color={data.selectedStatus == name.toLowerCase() ? 'primary' : 'primary-invert'}
				type="link"
				{href}>{name}</Button
			>
		{/each}
	</div>
	<div class="body">
		{#key data.selectedStatus}
			<div in:fly={{ x: 100, delay: 450 }} out:fly={{ x: 100 }}>
				<slot />
			</div>
		{/key}
	</div>
</div>

<style lang="postcss">
	.tabs {
		@apply relative w-full space-y-4;
	}
	.header {
		@apply overflow-x-auto py-4;
	}
</style>
