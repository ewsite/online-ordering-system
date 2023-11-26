<script>
	import { themeColors } from '$lib/config/theme';
	export let name = null;
	export let value = null;
	export let id = null;
	export let checked;
	export let color = '';

	$: color = themeColors.verify(color, true) ? color : themeColors.getDefault();
</script>

<span>
	<input type="checkbox" {value} {name} {id} bind:checked class={`${color}`} />
	<label for={id}><slot /></label>
</span>

<style lang="postcss" src="./Toggle.postcss"></style>
