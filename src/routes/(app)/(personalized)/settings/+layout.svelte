<script>
	import { Container } from '$lib/layouts';
	import { SidePanelItem, SidePanelContainer } from '$lib/components';

	export let data;
	const navigations = {
		default: [
			{ name: 'Shipping Address', href: '/settings/address' },
			{ name: 'Account', href: '/settings/account' }
		]
	};
</script>

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
