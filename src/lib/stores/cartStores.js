import { writable } from 'svelte/store'
import { browser } from '$app/environment'
function cartStore() {
	let stopUsingCartStore = false
	const { set, subscribe, update } = writable(new Map())

	function clearAllItem() {
		set(new Map())
	}

	/**
	 * @param {string} productName
	 */
	function clearItem(productName) {
		update((oldSet) => {
			oldSet.delete(productName)
			return oldSet
		})
	}

	/**
	 * @param {string} productName
	 * @param {object} prop
	 */
	function addItem(productName, prop) {
		update((oldSet) => {
			oldSet.set(productName, prop)
			return oldSet
		})
	}

	/**
	 * @param {string} productName
	 */
	function findItem(productName) {
		let data = {}

		const unsub = subscribe((oldSet) => {
			data = oldSet.get(productName)
		})
		unsub()
		return data
	}

	if (browser && !stopUsingCartStore) {
		const items = localStorage.getItem('cart') ?? null

		if (items) {
			for (const item of JSON.parse(items)) {
				addItem(item[0], item[1])
			}
		}
	}
	const unsub = subscribe((items) => {
		if (!browser) return

		let itemsToLocalStorage = []

		for (const item of items) {
			itemsToLocalStorage.push(item)
		}

		localStorage.setItem('cart', JSON.stringify(itemsToLocalStorage))
	})

	function stopSavingProgressToLocalStorage() {
		if (browser) {
			unsub()
			stopUsingCartStore = true
			localStorage.removeItem('cart')
			console.warn(
				'we should remind you that you stopped saving progress to Local Storage.'
			)
		}
	}
	return {
		subscribe,
		addItem,
		clearItem,
		findItem,
		clearAllItem,
		stopSavingProgressToLocalStorage
	}
}

const cartStores = cartStore()
export default cartStores
