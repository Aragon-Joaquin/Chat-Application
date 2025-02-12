import { REQUEST_SHAPE } from './utils'

type LOGIN_ROUTES = '/'

export const LOGIN_REQUEST: REQUEST_SHAPE<LOGIN_ROUTES, 'GET' | 'POST'> = {
	rootRoute: '/login',
	listOfSubRoutes: {
		'/': {
			GET: { passJWT: true, bodyParametersName: ['userName, userPassword'] },
			POST: { passJWT: false, bodyParametersName: [] }
		}
	}
}
