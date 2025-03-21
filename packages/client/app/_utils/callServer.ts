import { HTTP_METHOD } from 'next/dist/server/web/http'
import { CREATE_BODY, CREATE_REQUEST_BODY } from './bodyRequests'
import { getJWT } from './JWTMethods'
import { URL_DATABASE } from './utils'

const GET_ROUTE = ({ rootRoute, subroute }: { rootRoute: string; subroute: string }) =>
	`${rootRoute}${subroute != '/' ? subroute : ''}`
const GET_DB_ENDPOINT = (endpoint: string) => `${URL_DATABASE}${endpoint === null || `${endpoint}`}`
const MAKE_FETCH = async ({
	route,
	HTTPmethod,
	passJWT,
	bodyArgs
}: {
	route: string
	HTTPmethod: HTTP_METHOD
	passJWT: boolean
	bodyArgs?: string | FormData | null
}) => {
	//! 'Content-Type' breaks if you send an image, happens with {'Content-Type': 'multipart/form-data'} too
	return (
		await fetch(GET_DB_ENDPOINT(route), {
			method: HTTPmethod,
			headers: {
				...{ ...(!(bodyArgs instanceof FormData) && { 'Content-Type': 'application/json' }) },
				...{ ...(passJWT && { Authorization: `Bearer ${await getJWT()}` }) }
			},
			...{ ...(bodyArgs != null && { body: bodyArgs }) }
		})
	).json()
}

//! need to be like this, since i can break the entire project if i modify the CREATE_BODY interface
export interface callServerParameters extends CREATE_BODY {
	passJWT?: boolean
	formData?: FormData
}

export async function callServer({
	rootRoute,
	subroute = '/',
	HTTPmethod,
	bodyFields,
	passJWT = false,
	formData
}: callServerParameters) {
	const route = GET_ROUTE({ rootRoute: rootRoute ?? '', subroute: subroute ?? '' })

	if (formData != undefined) return await MAKE_FETCH({ route, HTTPmethod, passJWT, bodyArgs: formData })
	const bodyParameter = CREATE_REQUEST_BODY({ rootRoute, subroute, HTTPmethod, bodyFields })

	return await MAKE_FETCH({
		route,
		HTTPmethod,
		passJWT,
		bodyArgs: bodyParameter != null ? JSON.stringify(bodyParameter) : null
	})
}
