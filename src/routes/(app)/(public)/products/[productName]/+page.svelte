<script lang="ts">
	import { Container } from '$lib/layouts'
	import { Button, NumberCounter } from '$lib/components'
	import { goto } from '$app/navigation'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import type { PageData, SubmitFunction } from './$types'
	export let data: PageData

	let quantity = 1
	let isItemAlreadyExistsToCart = false

	if (data?.cart) {
		isItemAlreadyExistsToCart = true
		data.cart.quantity = data?.cart?.quantity
	}

	const addToCart: SubmitFunction = async ({ formData }) => {
		if (!data.userInfo.loggedIn) {
			goto(`/login?redirect=${encodeURIComponent($page.url.pathname)}`)
		}
		const product = data?.product

		if (data?.cart) formData.set('cartId', String(data.cart.id))
		else formData.set('productId', String(product.id))

		return async ({ result }) => {
			if (result.type != 'failure') goto('/cart')

			if (result.type == 'failure') {
				goto('/logout')
			}
		}
	}
</script>

<svlete:head>
	<title>{data?.product?.name}</title>
</svlete:head>
<Container heading>
	<div class="grid md:grid-cols-2 grid-cols-1 gap-4">
		<div class="px-4">
			<img
				src={`/uploads/products/${data?.product?.url_name}`}
				alt={data.product.name}
				class="rounded"
			/>
		</div>
		<div class="space-y-2 flex flex-col">
			<div class="py-2">
				<h3 class="m-0">{data.product.name}</h3>
				<p class="m-0">69 Reviews</p>
				<p>Php {data.product.price}.00</p>
			</div>
			<hr />
			<div class="">
				<b>Description</b>
				<p>{data.product.description}</p>
			</div>
			{#if isItemAlreadyExistsToCart}
				<div class="px-3 py-4 rounded-md bg-yellow-700 text-slate-50">
					<b>You already ordered {quantity} pieces of {data.product.name}.</b>
				</div>
			{/if}
			<form method="POST" class="space-y-4 flex flex-col" use:enhance={addToCart}>
				<NumberCounter bind:value={quantity} name="quantity" required={true} min={1} />
				<div class="flex flex-col space-y-4">
					{#if data?.userInfo.loggedIn}
						{#if isItemAlreadyExistsToCart}
							<Button type={'submit'} color="primary-invert" formaction="?/editTocart"
								>SAVE AND GO TO CART</Button
							>
						{:else}
							<Button type={'submit'} color="primary-invert" formaction="?/addToCart"
								>ADD TO CART</Button
							>
						{/if}
					{/if}
					<Button
						type="link"
						href={`/checkout?productId=${data.product.id}&quantity=${quantity}`}
						>Buy Now</Button
					>
				</div>
			</form>
		</div>
	</div>
</Container>
