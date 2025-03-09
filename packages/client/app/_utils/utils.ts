//! d.ts === files are declaration files that contain only type information.
import { WS_PORT } from '@chat-app/utils/globalConstants'
import { LOGIN_REQUEST, ROOM_REQUEST } from './bodyRequests'

export const GET_BACKEND_URL = 'http://localhost' as const

export const URL_DATABASE = `${GET_BACKEND_URL}:3000` as const
export const URL_WS = `${GET_BACKEND_URL}:${WS_PORT}` as const

export type EVERY_ROUTE = typeof ROOM_REQUEST & typeof LOGIN_REQUEST

// doing keyof EVERY_ROUTE['listOfSubRoutes'] does not work
// and i dont want to import/export a type with <T extends EVERY_ROUTE>
// so i will be keeping this until it becomes unsufferable
export type LIST_OF_SUBROUTES =
	| keyof (typeof ROOM_REQUEST)['listOfSubRoutes']
	| keyof (typeof LOGIN_REQUEST)['listOfSubRoutes']

export type SELECT_ROUTE<T extends EVERY_ROUTE> = T

export const ROUTES_HASHMAP = {
	'/login': LOGIN_REQUEST,
	'/room': ROOM_REQUEST
}

export const transformToDate = (date: Date | undefined): string => {
	if (!date) return 'No date available'

	const rawDate = new Date(date)
		.toLocaleString('en-GB', {
			timeZone: 'UTC',
			day: 'numeric',
			month: '2-digit',
			year: '2-digit',
			hour: 'numeric',
			minute: '2-digit'
		})
		?.split(',')

	return rawDate?.length ? `${rawDate[0]} ${rawDate[1]}` : 'No date available'
}
