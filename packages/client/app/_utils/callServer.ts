import { CREATE_BODY, CREATE_REQUEST_BODY } from './bodyRequests'
import { getJWT } from './JWTMethods'
import { URL_DATABASE } from './utils'

const GET_DB_ENDPOINT = (endpoint: string) => `${URL_DATABASE}${endpoint === null || `${endpoint}`}`

export interface callServerParameters extends CREATE_BODY {
	passJWT?: boolean
}

export async function callServer({
	rootRoute,
	subroute = '/',
	HTTPmethod,
	bodyFields = [],
	passJWT = false
}: callServerParameters) {
	const bodyParameter = CREATE_REQUEST_BODY({ rootRoute, subroute, HTTPmethod, bodyFields })

	return (
		await fetch(GET_DB_ENDPOINT(`${rootRoute}${subroute != '/' ? subroute : ''}`), {
			method: HTTPmethod,
			headers: {
				'Content-Type': 'application/json'
			},
			...{ ...(passJWT && { headers: { Authorization: `Bearer ${await getJWT()}` } }) },
			body: JSON.stringify(bodyParameter)
		})
	).json()
}
