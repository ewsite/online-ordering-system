import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types.js'
import { $Enums } from '@prisma/client'

const allowedStatus = ['begin_order', 'cancelled', 'delivered']
export const load: LayoutServerLoad = ({ params }) => {
	let title: string | null = null
	const orderStatus = params.status.toUpperCase() as $Enums.OrderStatus

	if (!allowedStatus.includes(params.status)) throw redirect(301, '/dashboard')

	switch (orderStatus) {
		case $Enums.OrderStatus.BEGIN_ORDER:
			title = 'Awaiting Orders'
			break
		case $Enums.OrderStatus.CANCELLED:
			title = 'Cancelled Orders'
			break
		case $Enums.OrderStatus.DELIVERED:
			title = 'Delivered Orders'
			break
	}

	return {
		selectedStatus: params.status,
		customerOrderTitle: title
	}
}
