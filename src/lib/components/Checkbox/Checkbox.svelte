<script lang="ts">
	import { themeColors } from '$lib/config/theme'
	export let name: string
	export let value: string
	export let id: string
	export let color: string
	export let checked = false

	$: color = themeColors.verify(color, false) ? color : themeColors.getDefault()
</script>

<span>
	<input type="checkbox" {value} {name} {id} bind:checked class={`${color}`} />
	<label for={id}><slot /></label>
</span>

<style lang="postcss" src="./Checkbox.postcss"></style>
