import { REQUEST_SHAPE } from './utils'

type LOGIN_ROUTES = '/' | '/register'
export interface LOGIN_TYPES_RESPONSES {
	'/': { access_token: string }
	'/register': null
}

export const LOGIN_REQUEST: REQUEST_SHAPE<LOGIN_ROUTES> = {
	rootRoute: '/login',
	listOfSubRoutes: {
		'/': {
			POST: { passJWT: false, bodyParametersName: ['userName', 'userPassword'] }
		},
		'/register': {
			POST: { passJWT: false, bodyParametersName: ['userName', 'userPassword'] }
		}
	}
}
