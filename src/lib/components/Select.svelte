<script>
	export let options = Array()
	export let name = String()
	export let value = null
	export let id = String()
	export let placeholder = String()
	export let className = String()
	export let showLabel = true
	$: options =
		options?.filter(
			(option) => !Array.isArray(option) || 'name' in option || 'value' in option
		) || []
</script>

<span class={className}>
	{#if showLabel}
		<label for={id}>
			<slot>Untitled</slot>
		</label>
	{/if}
	<select {name} id={id || null} bind:value {placeholder}>
		{#if placeholder?.length}
			<option selected disabled>{placeholder}</option>
		{/if}
		{#each options as option}
			<option value={option.value} selected={option?.selected}>{option.name}</option>
		{/each}
	</select>
</span>

<style lang="postcss">
	span {
		@apply relative
            space-y-2;
	}
	label {
		@apply font-bold;
	}

	select {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='-6 -6 36 36' stroke-width='1.5' stroke='currentColor' class='w-6 h-6 dark:stroke-slate-100'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E%0A");
		background-repeat: no-repeat;
		background-position: right;
		background-size: contain;
		@apply w-full
            appearance-none
            p-2
            rounded
            border-2
            outline-2
            border-transparent
            bg-slate-200
            dark:bg-opacity-10
            font-bold;
	}

	select:focus {
		@apply outline
            outline-blue-500
            border-blue-300;
	}

	option {
		@apply dark:bg-neutral-800;
	}
</style>
