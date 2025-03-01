import { HTTP_METHOD } from 'next/dist/server/web/http'

type GENERAL_ROUTES = '/login' | '/room'

type HTTP_METHODS = Partial<{
	[key in HTTP_METHOD]: {
		passJWT: boolean
		bodyParametersName: (string | number)[]
	}
}>

export type REQUEST_SHAPE<Routes extends string> = {
	rootRoute: GENERAL_ROUTES
	listOfSubRoutes: {
		[key in Routes]: HTTP_METHODS
	}
}
