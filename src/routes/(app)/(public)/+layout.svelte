<script>
	import { fly } from 'svelte/transition';

	export let data;
</script>

{#key data?.url}
	<div>
		<main in:fly={{ x: 100 }} out:fly={{ x: -100 }}>
			<slot />
		</main>
	</div>
{/key}
