<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button, Modal, Input } from '$lib/components'
	import type { SubmitFunction } from './$types'

	let addProductModal = false
	let errorModalMessage = String()

	const addProduct: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type == 'failure') {
				errorModalMessage = result.data?.body?.message ?? 'One of the fields are invalid.'
				return
			}
			errorModalMessage = String()
			addProductModal = false
		}
	}
</script>

<h3>Product Editor</h3>
<div class="space-y-4">
	<p>You want to add a product to the shop?</p>
	<Button on:click={() => (addProductModal = true)}>Add Product</Button>
	<p>You want to edit or change product metadata?</p>
	<Button disabled>Coming Soon</Button>
	<p>You want to remove a product from the shop?</p>
	<Button disabled>Coming Soon</Button>
</div>
<Modal bind:openModal={addProductModal}>
	<svelte:fragment slot="title">Add Product</svelte:fragment>
	<svelte:fragment slot="body">
		<form action="?/add" method="post" use:enhance={addProduct}>
			<div class="flex flex-col space-y-4">
				{#if errorModalMessage?.length}
					<div class="bg-red-500 text-slate-50 rounded-md font-bold px-3 py-4">
						<b>{errorModalMessage}</b>
					</div>
				{/if}
				<Input name="name" required>Product Name</Input>
				<Input name="description" required>Description</Input>
				<Input name="price" type="number" required>Price</Input>
				<b>Image</b>
				<input name="images" type="file" accept=".jpg" required />
				<Button type="submit">Add Product</Button>
			</div>
		</form>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<p>Add Product Modal still in progress.</p>
	</svelte:fragment>
</Modal>
