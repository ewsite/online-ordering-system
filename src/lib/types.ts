export type TypeError = {
	[x: string]: {
		code: string
		message: string
		stepRedirect?: number
	}
}

export type TypeFormResponse = {
	success: boolean
	body?: TypeError
}
