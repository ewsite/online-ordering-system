<script lang="ts">
	import { Container } from '$lib/layouts'
	import { Button } from '$lib/components'
	import themeMode from '$lib/data/themeMode'
	import { onMount } from 'svelte'

	onMount(() => themeMode.initialize())
</script>

<Container heading={true} itemsToCenter={true}>
	<div>
		<h1>Oops!</h1>
		<p>Looks that we can't find a page that you're looking for.</p>
		<hr />
		<div class="flex flex-col space-y-4">
			<b>Do you want to go back to the homepage?</b>
			<span>
				<Button type="link" color="primary" href="/">Back to the Homepage</Button>
			</span>
		</div>
	</div>
</Container>
