import { UserInfo } from '../tableTypes'
import { REQUEST_SHAPE } from './utils'

type USER_ROUTES = '/' | '/uploadPhoto'

export interface USER_TYPES_RESPONSES {
	'/': UserInfo
	'/uploadPhoto': null
}

export const USER_REQUEST: REQUEST_SHAPE<USER_ROUTES> = {
	rootRoute: '/user',
	listOfSubRoutes: {
		'/': {
			GET: {
				passJWT: true,
				bodyParametersName: []
			}
		},
		'/uploadPhoto': {
			POST: {
				passJWT: true,
				bodyParametersName: [],
				fileName: 'file'
			}
		}
	}
}
