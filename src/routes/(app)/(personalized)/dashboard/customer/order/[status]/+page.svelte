<script>
	// @ts-nocheck
	// I need to find a way to add strong types in properties that is Prisma's JSON.
	// Any bugs that suddenly raised in this page are unexpected.
	import { Button, Modal, Select } from '$lib/components'
	import { Orders } from '$lib/layouts'
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte'
	import { invalidate } from '$app/navigation'
	import { $Enums as EnumStatus } from '@prisma/client'
	export let data

	const REFRESH_DURATION = 3000

	/**
	 * @type {NodeJS.Timer}
	 */
	let furina

	let orderDetails = null
	let openDetailsModal = false
	let openSetStatusModal = false

	const orderStatusOptions = [
		{ name: 'Preparing for Delivery', value: 'BEGIN_ORDER' },
		{ name: 'Packed', value: 'PACKED' },
		{ name: 'Shipped', value: 'SHIPPED' },
		{ name: 'Delievered', value: 'DELIVERED' },
		{ name: 'Cancelled', value: 'CANCELLED' }
	]

	onMount(() => {
		furina = setInterval(plzReload, REFRESH_DURATION)
	})

	async function plzReload() {
		await invalidate('orders:reload')
	}

	function openOrderDetails(order) {
		clearTimeout(furina)
		orderDetails = order
		openDetailsModal = true
	}

	function openSetStatus(order) {
		clearTimeout(furina)
		orderDetails = order
		openSetStatusModal = true
	}

	function closeAllModal() {
		orderDetails = null
		openSetStatusModal = false
		openDetailsModal = false
		furina = setInterval(plzReload, REFRESH_DURATION)
	}
</script>

<div class="cart-container">
	{#if data.orders.length}
		{#each data.orders as { products, id, orderStatus, profile }, index}
			<div class="cart-item">
				<Orders
					{products}
					orderId={id}
					status={orderStatus}
					from={`${profile?.firstName} ${profile?.lastName}`}
				/>
				<div class="actions">
					<div class="" />
					<div class="space-x-4 flex items-center">
						{#if data.selectedStatus == EnumStatus.OrderStatus.BEGIN_ORDER}
							<Button
								type="submit"
								color="primary"
								on:click={() => openSetStatus(data.orders[index])}
								>Set Order Status</Button
							>
						{/if}
						<Button
							type="submit"
							color="primary-invert"
							on:click={() => openOrderDetails(data.orders[index])}>Details</Button
						>
					</div>
				</div>
			</div>
		{/each}
	{:else}
		<b class="text-3xl text-center">No Orders</b>
	{/if}
</div>

{#if orderDetails}
	<Modal bind:openModal={openDetailsModal} on:close={closeAllModal}>
		<svelte:fragment slot="title">
			Order {orderDetails?.id} | Details
		</svelte:fragment>
		<svelte:fragment slot="body">
			<div class="space-y-4">
				<h5>Shipping Information</h5>
				<div>
					<span>
						<b>Name: </b>
						<p>
							{orderDetails?.shippingInfo?.firstName ?? ''}
							{orderDetails.shippingInfo?.lastName ?? ''}
						</p>
					</span>
					<span>
						<b>Address:</b>
						<p>
							{orderDetails?.shippingInfo?.unitFloor ?? 'N/A'}
							{orderDetails?.shippingInfo.streetBldgName}, Brgy. {orderDetails
								?.shippingInfo.barangay}, {orderDetails?.shippingInfo.city}, {orderDetails
								?.shippingInfo.province}
						</p>
					</span>
					<span>
						<b>Quantity</b>
						<p>{orderDetails?.quantity ?? 0} pcs</p>
					</span>
				</div>
				<hr />
				<h5>Profile Information</h5>
				{#if orderDetails?.profile}
					<div>
						<span>
							<b>Name: </b>
							<p>{orderDetails.profile.firstName} {orderDetails.profile.lastName}</p>
						</span>
						<span>
							<b>Age: </b>
							<p>{orderDetails.profile.age}</p>
						</span>
					</div>
				{/if}
			</div>
		</svelte:fragment>
	</Modal>
{/if}

<Modal bind:openModal={openSetStatusModal} on:close={closeAllModal}>
	<svelte:fragment slot="title">Set Order Status</svelte:fragment>
	<svelte:fragment slot="body">
		<form
			method="POST"
			action="?/setOrderStatus"
			use:enhance={({ formData }) => {
				formData.set('orderId', orderDetails?.id)
				formData.set('profileId', orderDetails?.profileId)

				return async ({ result }) => {
					if (result.type == 'failure') {
						console.error('Something wrong')
						return
					}

					await invalidate('await-orders:reload')
					closeAllModal()
				}
			}}
		>
			<div class="flex flex-col space-y-4">
				<h5 class="m-0">Order Status</h5>
				<p>
					If you want to inform {orderDetails?.profile?.firstName}
					{orderDetails?.profile?.lastName} about the status of the order. You can change order
					status of Order #{orderDetails?.id ?? ' Unknown ID'}.
				</p>
				<Select
					name="orderStatus"
					options={orderStatusOptions}
					value={orderDetails?.orderStatus}>Set Order Status</Select
				>
				<Button type="submit" color="success">Set Order Status</Button>
			</div>
		</form>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		Customer Profile ID: {orderDetails?.profile?.id}
	</svelte:fragment>
</Modal>

<style lang="postcss">
	.cart-container {
		@apply space-y-4;
	}
	.cart-item {
		@apply dark:bg-neutral-800 bg-slate-100 p-2 rounded-md;
	}
	.actions {
		@apply flex justify-between items-center;
	}
</style>
