<script lang="ts">
	import { SidePanelContainer, SidePanelItem } from '$lib/components'
	import { Container } from '$lib/layouts'
	import type { PageData } from './$types'

	export let data: PageData

	const navigations = {
		default: [{ name: 'Overview', href: '/dashboard' }],
		user: [{ name: 'Orders', href: '/dashboard/order' }],
		admin: [
			{ name: 'Customer Orders', href: '/dashboard/customer/order' },
			{ name: 'Product Editor', href: '/dashboard/product' }
		]
	}
</script>

<Container heading>
	<SidePanelContainer>
		<svelte:fragment slot="header">
			<h4>Dashboard</h4>
		</svelte:fragment>
		<svelte:fragment slot="nav-items">
			{#each navigations.default as { name, href }}
				<SidePanelItem {href} active={data?.url === href}>{name}</SidePanelItem>
			{/each}
			{#if data?.userInfo?.role == 'admin'}
				{#each navigations.admin as { name, href }}
					<SidePanelItem {href} active={data?.url.startsWith(href)}>{name}</SidePanelItem>
				{/each}
			{:else}
				{#each navigations.user as { name, href }}
					<SidePanelItem {href} active={data?.url === href}>{name}</SidePanelItem>
				{/each}
			{/if}
		</svelte:fragment>
		<svelte:fragment slot="body">
			<slot />
		</svelte:fragment>
	</SidePanelContainer>
</Container>

<style lang="postcss">
</style>
