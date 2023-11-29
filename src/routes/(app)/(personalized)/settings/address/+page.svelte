<script lang="ts">
	import { Button, Modal, Input } from '$lib/components'
	import { invalidate } from '$app/navigation'
	import { enhance } from '$app/forms'
	import type { SubmitFunction } from './$types'
	export let data

	let nextTargetPlanet: (typeof data.addressList)[number] | null
	let openAddressModal = false

	function toggleModal() {
		openAddressModal = !openAddressModal
	}

	function editAddress(addressId: number) {
		nextTargetPlanet = data.addressList[addressId]
		toggleModal()
	}

	const addressWorkhorse: SubmitFunction = async ({ formData }) => {
		if (nextTargetPlanet) formData.set('id', nextTargetPlanet.id)

		return async ({ result }) => {
			nextTargetPlanet = null
			if (result.type == 'failure') {
				console.error('Oops')
				return
			}

			invalidate('settings-address:load')
			toggleModal()
		}
	}
</script>

<h3>Shipping Address</h3>

<p>Set up your addresses to be used for shipping address.</p>
<div class="address-box">
	{#each data?.addressList as { firstName, lastName, unitFloor, streetBldgName, barangay, city, province }, i}
		<button class="address-box-item" tabindex={i} on:click={() => editAddress(i)}>
			<b>{firstName} {lastName}</b>
			<p>
				{String(unitFloor)}
				{streetBldgName}, {barangay}, {city}, {province}
			</p>
		</button>
	{/each}
	<Button
		color="success-invert"
		className="flex items-center justify-center"
		on:click={toggleModal}
	>
		<span class="items-center justify-center flex space-x-2">
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
					d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>Add</span>
		</span>
	</Button>
</div>

<Modal bind:openModal={openAddressModal} on:close={() => (nextTargetPlanet = null)}>
	<svelte:fragment slot="title">
		{nextTargetPlanet ? 'Edit Address' : 'Add New Address'}
	</svelte:fragment>
	<svelte:fragment slot="body">
		{#if nextTargetPlanet}
			<form
				action="?/edit"
				method="POST"
				class="space-y-4 px-2"
				use:enhance={addressWorkhorse}
			>
				<div class="flex md:flex-row flex-col md:space-x-2 space-y-2 md:space-y-0">
					<Input
						type="text"
						bind:value={nextTargetPlanet.firstName}
						name="firstName"
						placeholder="First Name">First Name</Input
					>
					<Input
						type="text"
						bind:value={nextTargetPlanet.lastName}
						name="lastName"
						placeholder="Last Name">Last Name</Input
					>
				</div>
				<div class="flex md:flex-row flex-col md:space-x-2 space-y-2 md:space-y-0">
					<Input
						type="text"
						bind:value={nextTargetPlanet.unitFloor}
						name="unitFloor"
						placeholder="Unit/Floor">Unit/Floor</Input
					>
					<Input
						type="text"
						bind:value={nextTargetPlanet.streetBldgName}
						name="streetBldgName"
						placeholder="Street/Building">Street/Building Name</Input
					>
				</div>
				<div class="flex flex-col space-y-2">
					<Input
						type="text"
						bind:value={nextTargetPlanet.barangay}
						name="barangay"
						placeholder="Barangay">Barangay</Input
					>
					<Input
						type="text"
						bind:value={nextTargetPlanet.city}
						name="city"
						placeholder="City">City</Input
					>
					<Input
						type="text"
						bind:value={nextTargetPlanet.province}
						name="province"
						placeholder="Province">Province</Input
					>
				</div>
				<div class="flex space-x-4">
					<Button color="error-inver" type="submit" formaction="?/remove">Remove</Button>
					<Button color="success" type="submit">Save</Button>
				</div>
			</form>
		{:else}
			<form
				action="?/add"
				method="POST"
				class="space-y-4 px-2"
				use:enhance={addressWorkhorse}
			>
				<div class="flex md:flex-row flex-col md:space-x-2 space-y-2 md:space-y-0">
					<Input type="text" name="firstName" placeholder="First Name">First Name</Input>
					<Input type="text" name="lastName" placeholder="Last Name">Last Name</Input>
				</div>
				<div class="flex md:flex-row flex-col md:space-x-2 space-y-2 md:space-y-0">
					<Input type="text" name="unitFloor" placeholder="Unit/Floor">Unit/Floor</Input>
					<Input type="text" name="streetBldgName" placeholder="Street/Building"
						>Street/Building Name</Input
					>
				</div>
				<div class="flex flex-col space-y-2">
					<Input type="text" name="barangay" placeholder="Barangay">Barangay</Input>
					<Input type="text" name="city" placeholder="City">City</Input>
					<Input type="text" name="province" placeholder="Province">Province</Input>
				</div>
				<Button color="success" type="submit">Add</Button>
			</form>
		{/if}
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<a href="/questions" class="text-muted">Any Questions?</a>
	</svelte:fragment>
</Modal>

<style lang="postcss">
	.address-box {
		@apply grid md:grid-cols-2 grid-cols-1 gap-4;
	}

	.address-box-item {
		@apply text-left bg-slate-100 dark:bg-neutral-900 hover:dark:bg-neutral-700 hover:bg-slate-200 p-2 rounded-md transition;
	}
</style>
