import { REQUEST_SHAPE } from './utils'

type ROOM_ROUTES = '/' | '/roomhistory' | '/allRooms'

export interface ROOM_TYPES_RESPONSES {
	'/': null
	'/roomhistory': unknown
	'/allRooms': [string[], number]
}

export const ROOM_REQUEST: REQUEST_SHAPE<ROOM_ROUTES, 'GET'> = {
	rootRoute: '/room',
	listOfSubRoutes: {
		'/': {
			GET: {
				passJWT: false,
				bodyParametersName: []
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
