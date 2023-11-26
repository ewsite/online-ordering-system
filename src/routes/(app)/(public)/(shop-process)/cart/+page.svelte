<script>
	import { Container } from '$lib/layouts';
	import { Button, ItemsBoxContainer, ItemsBoxItem } from '$lib/components';
	import { invalidate } from '$app/navigation';
	import { enhance } from '$app/forms';

	export let data;
	let total = 0;

	$: {
		total = 0;
		if (data.cartItems) {
			for (const cart of data?.cartItems) {
				total += Number(cart?.product?.price) * Number(cart?.quantity);
			}
		}
	}
</script>

<svlete:head>
	<title>Cart</title>
</svlete:head>
<Container heading>
	<div class="cart-container">
		<div class="cart-header">
			<h3>Cart</h3>
			<div class="cart-header-actions">
				<b id="cart-price">Total: Php {total}.00</b>
				<span>
					<Button color="primary" type="link" href="/checkout" disabled={!data?.cartItems?.length}
						>Checkout</Button
					>
				</span>
			</div>
		</div>
		<div class="cart-body">
			<ItemsBoxContainer>
				{#each data?.cartItems as { product, id, quantity }}
					<form
						method="POST"
						use:enhance={({ formData }) => {
							formData.set('cartId', id);

							return async () => {
								invalidate('shop-process:reload');
							};
						}}
					>
						<ItemsBoxItem>
							<svelte:fragment slot="icon">
								<img
									src={`/uploads/products/${product.url_name}?size=sm`}
									alt=""
									class="w-full absolute"
								/>
							</svelte:fragment>
							<svelte:fragment slot="body">
								<b class="text-2xl">{product?.name}</b>
								<code>Php {product?.price}.00 x {quantity}</code>
							</svelte:fragment>
							<svelte:fragment slot="actions">
								<div class="flex flex-col space-y-2">
									<Button type="link" color="error-invert" href={`/products/${product?.url_name}`}
										>Edit</Button
									>
									<Button type="submit" formaction="?/remove" color="error">Remove</Button>
								</div>
							</svelte:fragment>
						</ItemsBoxItem>
					</form>
				{/each}
				<div class="add">
					<Button className="add" type="link" href="/shop">
						<b>Add More</b>
					</Button>
				</div>
			</ItemsBoxContainer>
		</div>
	</div>
</Container>

<style lang="postcss">
	.cart-container {
		@apply flex flex-col space-y-4 relative;
	}
	.cart-header {
		@apply flex justify-between max-md:flex-col;
	}
	.cart-header-actions {
		@apply flex items-center justify-between;
	}

	.add {
		@apply flex items-center justify-center;
	}
	#cart-price {
		@apply me-4;
	}
</style>
