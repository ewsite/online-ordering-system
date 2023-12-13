<script lang="ts">
	import { Container } from '$lib/layouts'
	import { SidePanelItem, SidePanelContainer } from '$lib/components'
	import type { LayoutData } from './$types'
	export let data: LayoutData

	let title: string
	const navigations = {
		default: [
			{ name: 'Shipping Address', href: '/settings/address' },
			{ name: 'Account', href: '/settings/account' }
		]
	}

	$: title =
		navigations.default.find((nav) => data?.url.startsWith(nav?.href))?.name ?? 'Settings'
</script>

<svelte:head>
	<title>{title} - {data.meta.title}</title>
</svelte:head>
<Container heading>
	<SidePanelContainer>
		<svelte:fragment slot="header">
			<h4>Settings</h4>
		</svelte:fragment>
		<svelte:fragment slot="nav-items">
			{#each navigations.default as { name, href }}
				<SidePanelItem {href} active={data?.url.startsWith(href)}>{name}</SidePanelItem>
			{/each}
		</svelte:fragment>
		<svelte:fragment slot="body">
			<slot />
		</svelte:fragment>
	</SidePanelContainer>
</Container>
