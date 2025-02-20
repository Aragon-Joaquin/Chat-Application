import { REQUEST_SHAPE } from './utils'

type LOGIN_ROUTES = '/' | '/register'

export const LOGIN_REQUEST: REQUEST_SHAPE<LOGIN_ROUTES, 'POST'> = {
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
