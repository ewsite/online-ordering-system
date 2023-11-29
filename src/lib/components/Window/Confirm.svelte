<script>
	import { createEventDispatcher } from 'svelte'
	import Button from '../Button.svelte'

	const dispatch = createEventDispatcher()
	let confirm
	export let openConfirm = false

	function close() {
		openConfirm = false
	}

	function open() {
		openConfirm = true
	}

	function triggerAccept() {
		dispatch('accept')
		dispatch('confirm', { confirm: true })
	}

	function triggerDeny() {
		dispatch('deny')
		dispatch('confirm', { confirm: false })
	}
	$: {
		if (openConfirm) confirm?.showModal()
		else confirm?.close()
	}

	// Extra piece of code, it won't affect or benefit to the core functionality of this component.
	function disregardThisMessage() {
		alert("We're launching a fucking content. Press OK to proceed")
		window.location.href = 'https://www.youtube.com/watch?v=r1ZVPTCOCSQ'
	}
</script>

<slot {disregardThisMessage} {open} />
{#if openConfirm}
	<dialog bind:this={confirm}>
		<div class="body">
			<div class="icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-24 h-24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
					/>
				</svg>
			</div>
			<div class="content">
				<h6>
					<slot name="title">Confirm</slot>
				</h6>
				<p>
					<slot name="description">Are you sure that you're not dumbass?</slot>
				</p>
			</div>
		</div>
		<div class="footer">
			<div class="footer-actions space-x-4">
				<Button on:click={triggerAccept} on:click={close}>
					<slot name="label-accept">Yes</slot>
				</Button>
				<Button color="primary-invert" on:click={triggerDeny} on:click={close}>
					<slot name="label-deny">No</slot>
				</Button>
			</div>
		</div>
	</dialog>
{/if}

<style lang="postcss">
	dialog {
		@apply flex
            flex-col
            space-y-4
            lg:w-1/2
            w-auto
			dark:bg-neutral-800
			bg-slate-100
			dark:text-slate-50
			p-4
			rounded-md;
	}

	.body {
		@apply grow flex items-center space-x-4;
	}

	.footer {
		@apply flex
            justify-end;
	}

	.footer-actions {
		@apply flex;
	}
	.icon {
		@apply flex items-center aspect-square;
	}
	p {
		@apply text-sm;
	}
</style>
