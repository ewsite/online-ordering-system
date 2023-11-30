<script lang="ts">
	import { Container } from '$lib/layouts'
	import { Button } from '$lib/components'
</script>

<svlete:head>
	<title>Home</title>
</svlete:head>
<Container
	itemsToCenter
	heading
	style="
	background: linear-gradient(121deg, rgba(190,0,154,1) 0%, rgba(255,0,86,1) 100%);"
>
	<div class="flex flex-col items-center">
		<h2 class="text-center">Moar Items @ Oww Zone Shop</h2>
		<h1 class="text-center">ON SALE!</h1>
		<Button type="link" href="shop" color="primary">Shop here</Button>
	</div>
</Container>
