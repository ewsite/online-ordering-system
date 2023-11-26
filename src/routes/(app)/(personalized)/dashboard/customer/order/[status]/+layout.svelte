<script>
	import { Button } from '$lib/components';
	import { fly } from 'svelte/transition';

	/**
	 * @type {string}
	 */
	let title;

	export let data;
	$: switch (data.selectedStatus) {
		case 'await':
			title = 'Awaiting Orders';
			break;
		case 'cancelled':
			title = 'Cancelled Orders';
			break;
		case 'delivered':
			title = 'Delivered Orders';
			break;
	}

	const navigationTabs = [
		{ name: 'Await', href: '/dashboard/customer/order/await' },
		{ name: 'Cancelled', href: '/dashboard/customer/order/cancelled' },
		{ name: 'Delivered', href: '/dashboard/customer/order/delivered' }
	];
</script>

<h3>{title}</h3>

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
