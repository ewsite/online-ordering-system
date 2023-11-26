<div class="items-container">
	<div class="items">
		<div class="furinamains">
			<div class="icon">
				<slot name="icon" />
			</div>
			<div class="body">
				<slot name="body" />
			</div>
		</div>
		<div class="actions">
			<slot name="actions" />
		</div>
	</div>
</div>

<style lang="postcss">
	.items {
		@apply flex space-x-4 justify-between items-center w-full;
	}

	.items {
		@apply p-2 rounded-md shadow-md bg-slate-100 hover:bg-slate-100 dark:bg-neutral-800 hover:dark:bg-neutral-700;
	}

	.furinamains {
		@apply grow flex space-x-4 w-full;
	}
	.icon {
		@apply w-16 relative overflow-hidden aspect-square;
	}
	.body {
		@apply flex flex-col justify-center items-baseline w-full;
	}
</style>
