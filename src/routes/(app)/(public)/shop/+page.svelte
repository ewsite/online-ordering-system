<script lang="ts">
	import { Container } from '$lib/layouts'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<svlete:head>
	<title>Shop</title>
</svlete:head>
<Container heading>
	<div class="row">
		<span>
			<h3>Shop</h3>
		</span>
	</div>
	<div class="row">
		<div class="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-4">
			{#each data?.products as product}
				<a
					class="shadow-md rounded-md overflow-hidden bg-slate-100 dark:bg-neutral-800 p-2 space-y-4"
					href={`products/${product?.url_name}`}
				>
					<div class="relative aspect-square overflow-hidden">
						<img
							src={`/uploads/products/${product.url_name}?size=md`}
							alt={product?.name}
						/>
					</div>
					<div class="">
						<b>{product?.name}</b>
						<p>Php. {product?.price}.00</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</Container>
