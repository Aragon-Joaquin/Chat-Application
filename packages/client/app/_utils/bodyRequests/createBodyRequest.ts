import { HTTP_METHOD } from 'next/dist/server/web/http'
import { EVERY_ROUTE, LIST_OF_SUBROUTES, ROUTES_HASHMAP } from '../utils'
import { BadRequest, BadRequestCodes } from '../../_errors'

export type CREATE_BODY = {
	rootRoute: EVERY_ROUTE['rootRoute']
	subroute?: LIST_OF_SUBROUTES
	HTTPmethod: HTTP_METHOD
	bodyFields?: (string | number)[] | []
}

export function CREATE_REQUEST_BODY({ rootRoute, subroute, HTTPmethod, bodyFields }: CREATE_BODY) {
	if (bodyFields == undefined) return null

	const getRoute = ROUTES_HASHMAP[rootRoute as keyof typeof ROUTES_HASHMAP]
	if (!(`${subroute}` in getRoute['listOfSubRoutes']))
		throw new BadRequest('Bad subroute specification.', BadRequestCodes.BAD_REQUEST)

	const specificRoute = getRoute.listOfSubRoutes[subroute as keyof typeof getRoute.listOfSubRoutes]
	if (!(`${HTTPmethod}` in specificRoute))
		throw new BadRequest('HTTP Method is not defined', BadRequestCodes.BAD_REQUEST)

	const getMethodInformation = specificRoute[HTTPmethod as keyof typeof specificRoute]
	if (getMethodInformation == null || getMethodInformation?.bodyParametersName?.length <= 0) return null

	const arrayOfInformation = getMethodInformation.bodyParametersName.map((field, i) => {
		return { [field]: bodyFields[i] ?? '' }
	})

	return Object.assign({}, ...arrayOfInformation)
}
