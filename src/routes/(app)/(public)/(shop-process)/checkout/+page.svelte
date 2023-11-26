<script>
	import { enhance } from '$app/forms';
	import { Button, Select } from '$lib/components';
	import { Container } from '$lib/layouts';
	import { goto } from '$app/navigation';
	import Orders from '$lib/layouts/Orders.svelte';

	export let data;
	let total = 0;
	let selectedShippingAddress = String();
	let errorMessage = String();
	$: {
		total = 0;
		if (data?.cartItems !== undefined || data.cartItems) {
			for (const cart of data?.cartItems) {
				total += Number(cart?.product?.price) * Number(cart?.quantity);
			}
		}
	}
	const paymentMethods = [{ name: 'Cash on Delivery', value: 'cash' }];

	/**
	 * @param {string} addressId
	 */
	function setSelectedShippingAddress(addressId) {
		selectedShippingAddress = addressId;
	}
</script>

<svlete:head>
	<title>{data.autoCheckout ? 'Auto-Checkout' : 'Checkout'}</title>
</svlete:head>
{#if data?.cartItems?.length}
	<Container heading>
		<div class="checkout-container">
			<div class="checkout-form space-y-4">
				<h3>{data.autoCheckout ? 'Auto-Checkout' : 'Checkout'}</h3>
				{#if errorMessage.length}
					<div class="pb-4">
						<div class="rounded bg-red-600 text-slate-50 px-4 py-3">
							<b>{errorMessage}</b>
						</div>
					</div>
				{/if}
				<b>Shipping Books</b>
				<div class="address-box">
					{#if data?.addressList?.length}
						{#each data?.addressList as address, i}
							<button
								class="address-box-item"
								class:selected={selectedShippingAddress == address.id}
								tabindex={i}
								on:click={() => setSelectedShippingAddress(address.id)}
							>
								<b>{address.firstName} {address.lastName}</b>
								<p>
									{address.unitFloor ?? ''}
									{address.streetBldgName}, {address.barangay}, {address.city}, {address.province}
								</p>
							</button>
						{/each}
					{:else}
						<a class="address-box-item" href="/settings/address"> Set up your address first. </a>
					{/if}
				</div>
				<form
					method="POST"
					class="space-y-4"
					use:enhance={({ formData, cancel }) => {
						if (!selectedShippingAddress) {
							errorMessage = 'Please select Shipping Address.';
							cancel();
							return;
						} else if (!formData.get('paymentMethod')) {
							errorMessage = 'Select Payment Method.';
							cancel();
							return;
						}
						formData.set('shippingInfoId', selectedShippingAddress);
						if (data?.autoCheckout) formData.set('productId', data?.cartItems[0]?.product?.id);

						return async ({ result }) => {
							if (result.type == 'failure') {
								console.error(result.data?.body);
								return;
							}

							goto('/dashboard/order');
						};
					}}
				>
					<div>
						<Select
							name="paymentMethod"
							options={paymentMethods}
							className="my-2"
							placeholder="Select Payment Method">Payment Method</Select
						>
					</div>
					<Button type="submit">Checkout</Button>
				</form>
			</div>

			<div class="checkout-cart">
				<div class="checkout-cart-header">
					<h5 class="m-0">{data?.cartItems?.length} Items</h5>
					{#if !data.autoCheckout}
						<Button type="link" color="primary-invert" href="/cart">Edit</Button>
					{/if}
				</div>
				<div class="checkout-cart-body">
					<Orders products={data?.cartItems} hideOrderNumber />
				</div>
				<div class="checkout-paimon-actions">
					<div class="checkout-summary">
						<b>Total to Pay</b>
						<b class="text-4xl">Php {total}.00</b>
					</div>
				</div>
			</div>
		</div>
	</Container>
{:else}
	<Container itemsToCenter={true}>
		<h3>You don't have items in the cart.</h3>
		<Button type="link" href="/shop">Shop Now</Button>
	</Container>
{/if}

<style lang="postcss">
	.checkout-container {
		@apply grid md:grid-cols-2 grid-cols-1 gap-4 space-y-4;
	}

	.checkout-cart {
		@apply space-y-4;
	}
	.checkout-cart-body {
		@apply flex flex-col relative;
	}

	.checkout-paimon-actions {
		@apply fixed rounded w-64 bottom-8 right-8 px-4 py-3 bg-slate-100 dark:bg-neutral-900 shadow-lg;
	}
	.checkout-cart-header {
		@apply flex items-center justify-between;
	}

	.checkout-summary {
		@apply flex flex-col;
	}
	.address-box {
		@apply grid md:grid-cols-2 grid-cols-1 gap-4;
	}

	.address-box-item {
		@apply text-left bg-slate-100 dark:bg-neutral-900 hover:dark:bg-neutral-700 hover:bg-slate-200 p-2 rounded-md transition;
	}

	.address-box-item.selected {
		@apply text-green-500 bg-green-500 bg-opacity-10 hover:bg-green-600 hover:text-slate-50;
	}
</style>
