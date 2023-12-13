<script lang="ts">
	import { enhance } from '$app/forms'
	import { Button, Select } from '$lib/components'
	import { Container } from '$lib/layouts'
	import { goto } from '$app/navigation'
	import Orders from '$lib/layouts/Orders.svelte'
	import type { PageData, SubmitFunction } from './$types'
	import { fade, slide } from 'svelte/transition'

	export let data: PageData

	let total = 0
	let selectedShippingAddress: string
	let errorMessage: string
	$: {
		total = 0
		if (data?.cartItems?.length) {
			for (const cart of data.cartItems) {
				total += Number(cart?.product?.price) * Number(cart?.quantity)
			}
		}
	}
	const paymentMethods = [{ name: 'Cash on Delivery', value: 'cash' }]

	function setSelectedShippingAddress(addressId: typeof selectedShippingAddress) {
		selectedShippingAddress = addressId
	}

	const checkout: SubmitFunction = async ({ formData, cancel }) => {
		if (!selectedShippingAddress) {
			errorMessage = 'Please select Shipping Address.'
			cancel()
			return
		} else if (!formData.get('paymentMethod')) {
			errorMessage = 'Select Payment Method.'
			cancel()
			return
		}
		formData.set('shippingInfoId', selectedShippingAddress)
		if (data.autoCheckout && data?.cartItems) {
			const cartItems = data?.cartItems[0] ?? null
			formData.set('productId', String(cartItems?.product?.id))
			formData.set('quantity', String(cartItems?.quantity))
		}

		return async ({ result }) => {
			if (result.type == 'failure') {
				console.error(result.data?.body)
				return
			}

			goto('/dashboard/order')
		}
	}
</script>

<svlete:head>
	<title>{data.autoCheckout ? 'Auto-Checkout' : 'Checkout'} - {data.meta.title}</title>
</svlete:head>
{#if data?.cartItems?.length}
	<Container heading>
		<div class="checkout-container">
			<div class="checkout-form space-y-4">
				<h3>{data.autoCheckout ? 'Auto-Checkout' : 'Checkout'}</h3>
				{#if errorMessage?.length}
					<div class="pb-4">
						<div class="rounded bg-red-600 text-slate-50 px-4 py-3">
							<b>{errorMessage}</b>
						</div>
					</div>
				{/if}
				<b>Shipping Books</b>
				<div class="address-box">
					{#if data.addressList?.length}
						{#each data.addressList as address, i}
							<Button
								color={selectedShippingAddress == address.id
									? 'success'
									: 'primary-invert'}
								on:click={() => setSelectedShippingAddress(address.id)}
							>
								<div class="flex space-x-2 items-center">
									{#if selectedShippingAddress == address.id}
										<svg
											transition:fade={{ duration: 150 }}
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="w-6 h-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M4.5 12.75l6 6 9-13.5"
											/>
										</svg>
									{/if}
									<div class="transition-all duration-150 text-left">
										<b>{address.firstName} {address.lastName}</b>
										<p class="m-0">
											{String(address.unitFloor)}
											{address.streetBldgName}, {address.barangay}, {address.city}, {address.province}
										</p>
									</div>
								</div>
							</Button>
						{/each}
					{:else}
						<Button type="link" href="/settings/address?fc=1">
							<div class="flex space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 4.5v15m7.5-7.5h-15"
									/>
								</svg>
								<b>Add Address</b>
							</div>
						</Button>
					{/if}
				</div>
				<form method="POST" class="space-y-4" use:enhance={checkout}>
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
		<div class="">
			<h3>You don't have items in the cart.</h3>
			<Button type="link" href="/shop">Shop Now</Button>
		</div>
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
</style>
