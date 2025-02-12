import { HTTP_METHOD } from 'next/dist/server/web/http'
import { EVERY_ROUTE, ROUTES_HASHMAP } from './utils'

export type CREATE_BODY = {
	rootRoute: EVERY_ROUTE['rootRoute']
	subroute: keyof EVERY_ROUTE['listOfSubRoutes']
	HTTPmethod: HTTP_METHOD
	bodyFields: (string | number)[] | []
}

export function CREATE_REQUEST_BODY({ rootRoute, subroute, HTTPmethod, bodyFields }: CREATE_BODY) {
	const getRoute = ROUTES_HASHMAP[rootRoute as keyof typeof ROUTES_HASHMAP]

	if (!(`${subroute}` in getRoute)) return null
	if (!(`${HTTPmethod}` in getRoute.listOfSubRoutes[subroute])) return null

	const getSubrouteAllMethods = getRoute.listOfSubRoutes[subroute]
	if (!(`${HTTPmethod}` in getSubrouteAllMethods)) return null

	const getMethodIformation = getSubrouteAllMethods[HTTPmethod as keyof typeof getSubrouteAllMethods]

	if (getMethodIformation.bodyParametersName?.length <= 0) return null

	const arrayOfInformation = getMethodIformation.bodyParametersName.map((field, i) => {
		return { [field]: [bodyFields[i] ?? null] }
	})

	return { ...{ body: Object.assign({}, ...arrayOfInformation) } }
}
