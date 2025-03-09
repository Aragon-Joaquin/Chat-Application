import { REQUEST_SHAPE } from './utils'

type LOGIN_ROUTES = '/' | '/register' | '/getUser'
export interface LOGIN_TYPES_RESPONSES {
	'/': { access_token: string }
	'/register': null
	'/getUser': { user_name: string; user_id: number; profile_picture: string | '' }
}

export const LOGIN_REQUEST: REQUEST_SHAPE<LOGIN_ROUTES> = {
	rootRoute: '/login',
	listOfSubRoutes: {
		'/': {
			POST: { passJWT: false, bodyParametersName: ['userName', 'userPassword'] }
		},
		'/register': {
			POST: { passJWT: false, bodyParametersName: ['userName', 'userPassword'] }
		},
		'/getUser': {
			GET: { passJWT: true, bodyParametersName: [] }
		}
	}
}
