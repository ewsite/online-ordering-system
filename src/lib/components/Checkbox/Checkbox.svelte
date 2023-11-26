<script>
	import { themeColors } from '$lib/config/theme';
	export let name = null;
	export let value = null;
	export let id = null;
	export let color = null;
	export let checked;

	$: color = themeColors.verify(color, false) ? color : themeColors.getDefault();
</script>

<span>
	<input type="checkbox" {value} {name} {id} bind:checked class={`${color}`} />
	<label for={id}><slot /></label>
</span>

<style lang="postcss" src="./Checkbox.postcss"></style>
