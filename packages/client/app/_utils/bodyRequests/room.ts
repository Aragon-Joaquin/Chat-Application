import { roomState } from '@/app/(pages)/(room)/room/_reducers/roomReducer/types'
import { REQUEST_SHAPE } from './utils'

type ROOM_ROUTES = '/' | '/roomhistory' | '/allRooms'

export interface ROOM_TYPES_RESPONSES {
	'/': null
	'/roomhistory': unknown
	'/allRooms': Array<roomState>
}

export const ROOM_REQUEST: REQUEST_SHAPE<ROOM_ROUTES> = {
	rootRoute: '/room',
	listOfSubRoutes: {
		'/': {
			GET: {
				passJWT: false,
				bodyParametersName: []
			},
			POST: {
				passJWT: true,
				bodyParametersName: ['room_name', 'room_password']
			}
		},
		'/roomhistory': {
			GET: {
				passJWT: true,
				bodyParametersName: ['roomName', 'limit', 'offset']
			}
		},
		'/allRooms': {
			GET: {
				passJWT: true,
				bodyParametersName: [] //maybe limit someday
			}
		}
	}
}
