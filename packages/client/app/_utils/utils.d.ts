//! d.ts === files are declaration files that contain only type information.
import { LOGIN_REQUEST, ROOM_REQUEST } from './bodyRequests'

export const URL_DATABASE = 'http://localhost:3000' as const
// export type URL_ENDPOINTS = { login: '/' } | { room: '/' | '/history' }

export type EVERY_ROUTE = typeof ROOM_REQUEST | typeof LOGIN_REQUEST
export type SELECT_ROUTE<T extends EVERY_ROUTE> = T

export const ROUTES_HASHMAP = {
	login: LOGIN_REQUEST,
	room: ROOM_REQUEST
}
