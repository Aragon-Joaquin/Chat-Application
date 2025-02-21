import { HTTP_METHOD } from 'next/dist/server/web/http'
import { EVERY_ROUTE, LIST_OF_SUBROUTES, ROUTES_HASHMAP } from '../utils'
import { BadRequest } from '../../_errors'

export type CREATE_BODY = {
	rootRoute: EVERY_ROUTE['rootRoute']
	subroute?: LIST_OF_SUBROUTES
	HTTPmethod: HTTP_METHOD
	bodyFields?: (string | number)[] | []
}

//! this function dont need to be this... verbose?
export function CREATE_REQUEST_BODY({ rootRoute, subroute, HTTPmethod, bodyFields }: CREATE_BODY) {
	if (bodyFields == undefined) return null

	const getRoute = ROUTES_HASHMAP[rootRoute as keyof typeof ROUTES_HASHMAP]
	if (!(`${subroute}` in getRoute['listOfSubRoutes'])) throw new BadRequest('Bad subroute specification.', 400)

	const specificRoute = getRoute.listOfSubRoutes[subroute as keyof typeof getRoute.listOfSubRoutes]
	if (!(`${HTTPmethod}` in specificRoute)) throw new BadRequest('HTTP Method is not defined', 400)

	// TODO: TS infers the types that are overlap since its a union between two or more types, somehow fix?
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const getMethodInformation: any = specificRoute[HTTPmethod as keyof typeof specificRoute]
	if (getMethodInformation.bodyParametersName?.length <= 0) return null

	const arrayOfInformation = getMethodInformation.bodyParametersName.map((field: string, i: number) => {
		return { [field]: bodyFields[i] ?? '' }
	})

	return { body: JSON.stringify(Object.assign({}, ...arrayOfInformation)) }
}
