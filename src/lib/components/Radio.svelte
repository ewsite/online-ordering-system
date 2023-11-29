<script>
	export let name = null
	export let items = []
	export let group = null

	$: items =
		items.filter((item) => 'label' in item && 'id' in item && 'value' in item) || []
</script>

<div>
	{#each items as item}
		<span>
			<input type="radio" value={item.value} {name} id={item.id} bind:group />
			<label for={item.id}>{item.label}</label>
		</span>
	{/each}
</div>

<style lang="postcss">
	span {
		@apply flex
        items-center
        space-x-2;
	}

	span:not(:last-child) {
		@apply mb-2;
	}
	input {
		@apply w-6
        h-6
        relative
        cursor-pointer
        appearance-none
        border-4
        border-slate-400
        rounded-full;
	}

	input:checked {
		@apply bg-blue-500
        border-4
        border-blue-300;
	}
</style>
