<script>
	import { themeColors } from '$lib/config/theme';
	export let name = null;
	export let group;
	export let items = [];
	export let color = '';

	$: color = themeColors.verify(color, true) ? color : themeColors.getDefault();
	$: items = items.filter((item) => 'label' in item && 'id' in item && 'value' in item) || [];
</script>

<div>
	{#each items as item}
		<span>
			<input type="checkbox" value={item.value} {name} id={item.id} bind:group class={`${color}`} />
			<label for={item.id}>{item.label}</label>
		</span>
	{/each}
</div>

<style lang="postcss" src="./Checkbox.postcss"></style>
