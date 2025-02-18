import { HTTP_METHOD } from 'next/dist/server/web/http'

type GENERAL_ROUTES = '/login' | '/room'

export type REQUEST_SHAPE<Routes extends string, HTTPMethod extends HTTP_METHOD> = {
	rootRoute: GENERAL_ROUTES
	listOfSubRoutes: {
		[key in Routes]: {
			[key in HTTPMethod]: {
				passJWT: boolean
				bodyParametersName: (string | number)[]
			}
		}
	}
}
