import { REQUEST_SHAPE } from './utils'

type ROOM_ROUTES = '/' | '/roomhistory'

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
		}
	}
}
