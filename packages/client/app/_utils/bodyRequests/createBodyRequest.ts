import { HTTP_METHOD } from 'next/dist/server/web/http'
import { EVERY_ROUTE, LIST_OF_SUBROUTES, ROUTES_HASHMAP } from '../utils'

export type CREATE_BODY = {
	rootRoute: EVERY_ROUTE['rootRoute']
	subroute?: LIST_OF_SUBROUTES
	HTTPmethod: HTTP_METHOD
	bodyFields?: (string | number)[] | []
}

//! this function dont need to be this... verbose?
export function CREATE_REQUEST_BODY({ rootRoute, subroute, HTTPmethod, bodyFields }: CREATE_BODY) {
	const getRoute = ROUTES_HASHMAP[rootRoute as keyof typeof ROUTES_HASHMAP]
	if (!(`${subroute}` in getRoute) || bodyFields == undefined) return null

	const specificRoute = getRoute.listOfSubRoutes[subroute as keyof typeof getRoute.listOfSubRoutes]
	if (!(`${HTTPmethod}` in specificRoute)) return null

	const getMethodInformation = specificRoute[HTTPmethod as keyof typeof specificRoute]
	if (getMethodInformation.bodyParametersName?.length <= 0) return null

	const arrayOfInformation = getMethodInformation.bodyParametersName.map((field, i) => {
		return { [field]: [bodyFields[i] ?? null] }
	})

	return { ...{ body: Object.assign({}, ...arrayOfInformation) } }
}
