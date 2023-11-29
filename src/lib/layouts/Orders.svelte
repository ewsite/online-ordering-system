<script lang="ts">
	// @ts-nocheck
	// I need to find a way to add strong types in properties that is Prisma's JSON.
	// Any bugs that suddenly raised in this layout are unexpected.
	import { ItemsBoxContainer, ItemsBoxItem } from '$lib/components'
	import type { Prisma } from '@prisma/client'

	export let products: Prisma.JsonValue
	export let orderId = Number()
	export let from = String()
	export let status = String()
	export let hideOrderNumber = false

	const orderStatusOptions = [
		{ name: 'Preparing for Delivery', value: 'BEGIN_ORDER' },
		{ name: 'Packed', value: 'PACKED' },
		{ name: 'Shipped', value: 'SHIPPED' },
		{ name: 'Delievered', value: 'DELIVERED' },
		{ name: 'Cancelled', value: 'CANCELLED' }
	]
	let total: boolean = 0
	$: {
		total = 0
		products.map(({ product, quantity }) => {
			total += product?.price * quantity
			console.log(product?.price, quantity)
		})
	}

	$: orderStatus = orderStatusOptions.find(({ value }) => value == status)
</script>

<div class="orders">
	<div class="header">
		{#if !hideOrderNumber}
			<div class="">
				<b>Order #{orderId ?? ' Unknown ID'}</b>
				{#if from.length}
					<b>| From {from}</b>
				{/if}
			</div>
		{/if}
		<div>
			{orderStatus?.name ?? ''}
		</div>
	</div>
	<div class="orders-item">
		<ItemsBoxContainer forceOneRow={true}>
			{#each products as { product, quantity }}
				<ItemsBoxItem>
					<svelte:fragment slot="icon">
						<img
							src={`/uploads/products/${product.url_name}?size=sm`}
							alt=""
							class="w-full absolute"
						/>
					</svelte:fragment>
					<svelte:fragment slot="body">
						<div class="grid grid-cols-2 gap-4 text-left grow w-full">
							<div class="flex flex-col justify-center">
								<b class="text-xl">{product?.name}</b>
							</div>
						</div>
					</svelte:fragment>
					<svelte:fragment slot="actions">
						<b>{quantity ?? 'Unknown'} pcs</b>
					</svelte:fragment>
				</ItemsBoxItem>
			{/each}
		</ItemsBoxContainer>
	</div>
	<div class="footer">
		<b>{products?.length ?? 0} items.</b>
		<p>Total: <b>Php. {total}.00</b></p>
	</div>
</div>

<style lang="postcss">
	.orders {
		@apply p-2 rounded;
	}
	.orders-item {
		@apply py-2;
	}

	.header {
		@apply flex justify-between items-center;
	}
	.footer {
		@apply flex p-2 space-x-4 justify-between;
	}
</style>
