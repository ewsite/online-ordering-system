<script>
	/**
	 * @type {string | number | null}
	 */
	export let value = null

	export let hiddenLabel = false
	export let id = String()
	export let name = String()
	export let placeholder = String()
	export let notes = String()
	export let type = String()
	export let required = false
</script>

<span>
	{#if !hiddenLabel}
		<label for={id}>
			<b>
				<slot>Untitled</slot>
			</b>
		</label>
	{/if}
	<div>
		{#if type === 'email'}
			<input type="email" bind:value id={id || null} {name} {placeholder} {required} />
		{:else if type === 'password'}
			<input type="password" bind:value id={id || null} {name} {placeholder} {required} />
		{:else if type === 'number'}
			<input type="number" bind:value id={id || null} {name} {placeholder} {required} />
		{:else}
			<input type="text" bind:value id={id || null} {name} {placeholder} {required} />
		{/if}
		{#if notes?.length}
			<p class="notes">
				{notes}
			</p>
		{/if}
	</div>
</span>

<style lang="postcss">
	span {
		@apply space-y-2
            max-w-full
            w-full;
	}

	input {
		@apply w-full
            px-2
            py-2
            grow
            bg-transparent;
	}

	input:focus {
		@apply outline-none;
	}
	div:focus-within {
		@apply border-rose-600
            border-2;
	}

	div {
		@apply relative
            rounded
            p-0.5
            border-2
            border-transparent
            bg-slate-200
            dark:bg-opacity-10
            flex
            items-center
            outline-2;
	}
	.notes {
		@apply m-0
            px-4;
	}
</style>
