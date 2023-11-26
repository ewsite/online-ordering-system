<script>
	import { themeColors } from '$lib/config/theme';
	/**
	 * @type {string?}
	 */
	export let type = String();
	export let href = String();
	export let id = String();
	export let color = String();
	export let className = String();
	export let preventDefault = false;
	export let formaction = String();
	export let disabled = false;

	$: color = themeColors.verify(color, true) ? color : themeColors.getDefault();
</script>

{#if type === 'link'}
	{#if preventDefault}
		<a
			href={!disabled ? href : null}
			id={id || null}
			class={`${color} ${className}`}
			class:disabled
			on:click|preventDefault
			on:dblclick><slot /></a
		>
	{:else}
		<a
			href={!disabled ? href : null}
			id={id || null}
			class={`${color} ${className}`}
			class:disabled
			on:click
			on:dblclick><slot /></a
		>
	{/if}
{:else if type === 'submit'}
	<button
		id={id || null}
		class={`${color} ${className}`}
		class:disabled
		on:click
		on:dblclick
		formaction={formaction || null}
		{disabled}><slot /></button
	>
{:else}
	<button
		id={id || null}
		class={`${color} ${className}`}
		class:disabled
		on:click|preventDefault
		{disabled}><slot /></button
	>
{/if}

<style lang="postcss">
	a,
	button {
		@apply px-4
        py-2
        rounded-full
        font-bold
        uppercase
        transition
        duration-200
        shadow-sm
		text-center;
	}
	.disabled {
		@apply cursor-not-allowed;
	}
	/* Colors -- Default Version */

	.primary:not(.disabled) {
		@apply bg-rose-600 text-slate-50 hover:bg-rose-700;
	}
	.primary.disabled {
		@apply bg-rose-500 text-slate-50;
	}
	.secondary:not(.disabled) {
		@apply bg-violet-500 text-slate-50 hover:bg-violet-600;
	}
	.secondary.disabled {
		@apply bg-violet-400 text-slate-50;
	}
	.warning:not(.disabled) {
		@apply bg-yellow-400 text-slate-50 hover:bg-yellow-500;
	}
	.warning.disabled {
		@apply bg-yellow-300 text-slate-50;
	}
	.success:not(.disabled) {
		@apply bg-green-500 text-slate-50 hover:bg-green-600;
	}
	.success.disabled {
		@apply bg-green-400 text-slate-50;
	}

	.error:not(.disabled) {
		@apply bg-red-500 text-slate-50 hover:bg-red-600;
	}
	.error.disabled {
		@apply bg-red-400 text-slate-50;
	}
	.plain:not(.disabled) {
		@apply bg-slate-950 bg-opacity-5;
	}

	/* Colors -- Default Version */
	.primary-invert:not(.disabled) {
		@apply text-rose-600 bg-rose-600 bg-opacity-10 hover:bg-rose-500 hover:text-slate-50;
	}
	.primary-invert.disabled {
		@apply text-rose-500 bg-rose-400 bg-opacity-10;
	}
	.secondary-invert:not(.disabled) {
		@apply text-violet-500 bg-violet-500 bg-opacity-10 hover:bg-violet-600 hover:text-slate-50;
	}
	.secondary-invert.disabled {
		@apply text-violet-500 bg-violet-400 bg-opacity-10;
	}
	.warning-invert:not(.disabled) {
		@apply text-yellow-400 bg-yellow-500 bg-opacity-10 hover:bg-yellow-500 hover:text-slate-50;
	}
	.warning-invert.disabled {
		@apply text-yellow-400 bg-yellow-400 bg-opacity-10;
	}
	.success-invert:not(.disabled) {
		@apply text-green-500 bg-green-500 bg-opacity-10 hover:bg-green-600 hover:text-slate-50;
	}
	.success-invert.disabled {
		@apply text-green-500 bg-green-400 bg-opacity-10;
	}
	.error-invert:not(.disabled) {
		@apply text-red-500 bg-red-500 bg-opacity-10 hover:bg-red-600 hover:text-slate-50;
	}
	.error-invert.disabled {
		@apply text-red-500 bg-red-400 bg-opacity-10;
	}
</style>
