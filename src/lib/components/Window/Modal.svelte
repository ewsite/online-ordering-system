<script>
	import { createEventDispatcher } from 'svelte';
	import Button from '../Button.svelte';

	const dispatch = createEventDispatcher();

	/**
	 * @type {HTMLDialogElement}
	 */
	let modal;

	export let openModal = false;
	/**
	 * @type {function | null}
	 */
	export let onClose = null;

	function close() {
		openModal = false;
		if (typeof onClose == 'function') onClose();
	}

	function open() {
		openModal = true;
	}

	$: {
		if (openModal) {
			modal?.showModal();
			dispatch('open');
		} else {
			modal?.close();
			dispatch('close');
		}
	}

	function disregardThisMessage() {
		alert("We're launching a fucking content. Press OK to proceed");
		window.location.href = 'https://www.youtube.com/watch?v=r1ZVPTCOCSQ';
	}
</script>

<slot {disregardThisMessage} {open} />
{#if openModal}
	<dialog bind:this={modal}>
		<div class="header">
			<span>
				<b>
					<slot name="title">Untitled</slot>
				</b>
			</span>
			<button on:click={close}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
		<div class="body">
			<slot name="body">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit quae minima blanditiis
				officiis repudiandae! Nihil, reprehenderit quia unde, ipsum fugiat assumenda architecto
				commodi soluta aperiam esse nisi deleniti, maiores totam.
			</slot>
		</div>
		<div class="footer">
			<slot name="footer" closeModal={close}>
				<Button on:click={close}>OK</Button>
			</slot>
		</div>
	</dialog>
{/if}

<style lang="postcss">
	dialog {
		@apply flex
        flex-col
        lg:w-3/4
        lg:h-3/4
        h-full
        w-auto
        space-y-4
        rounded
        dark:text-slate-50
        bg-slate-100
        dark:bg-neutral-900
        p-4;
	}
	.header {
		@apply flex
        items-center
        w-full
        justify-between;
	}

	.body {
		@apply grow
        overflow-auto;
	}

	.footer {
		@apply flex
        justify-between;
	}
</style>
