<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import type { PageData } from './$types'
	invalidateAll()
	export let data: PageData
</script>

<svelte:head>
	<meta http-equiv="refresh" content="1; url=/" />
	<title>Log Out - {data.meta.title}</title>
</svelte:head>

<h1>Logging Out</h1>
