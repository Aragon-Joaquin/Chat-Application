//! d.ts === files are declaration files that contain only type information.
import { LOGIN_REQUEST, ROOM_REQUEST } from './bodyRequests'

export const URL_DATABASE = 'http://localhost:3000' as const

export type EVERY_ROUTE = typeof ROOM_REQUEST | typeof LOGIN_REQUEST

// doing keyof EVERY_ROUTE['listOfSubRoutes'] does not work
// and i dont want to import/export a type with <T extends EVERY_ROUTE>
// so i will be keeping this until it becomes unsufferable
export type LIST_OF_SUBROUTES =
	| keyof (typeof ROOM_REQUEST)['listOfSubRoutes']
	| keyof (typeof LOGIN_REQUEST)['listOfSubRoutes']

export type SELECT_ROUTE<T extends EVERY_ROUTE> = T

export const ROUTES_HASHMAP = {
	login: LOGIN_REQUEST,
	room: ROOM_REQUEST
}
