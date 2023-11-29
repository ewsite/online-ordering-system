<script>
	import { cubicOut } from 'svelte/easing'
	import { tweened } from 'svelte/motion'

	export let min = 0,
		max = 100,
		value = 60

	let isValueOverflow
	const caclulatedValue = tweened(value, {
		duration: 250,
		easing: cubicOut
	})

	$: {
		isValueOverflow = value < min || value > max
		if (!isValueOverflow) {
			const resValue = ((value - min) / (max - min)) * 100
			caclulatedValue.set(resValue)
		} else {
			caclulatedValue.set(100)
		}
	}
</script>

<div role="progressbar" aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}>
	<span class:overflow={isValueOverflow} style:width={`${$caclulatedValue}%`}
		>{isValueOverflow ? 'Overflowed' : `${value}%`}</span
	>
</div>

<style lang="postcss">
	div {
		@apply w-full
        bg-slate-100
        overflow-hidden
        rounded;
	}

	span {
		@apply block
        h-full
        bg-blue-600
        text-xs
        font-bold
        text-slate-100
        text-center
        p-1;
	}

	span.overflow {
		@apply bg-red-600;
	}
</style>
