import { CREATE_BODY, CREATE_REQUEST_BODY } from './bodyRequests'
import { getJWT } from './JWTMethods'
import { URL_DATABASE } from './utils'

const GET_DB_ENDPOINT = (endpoint: string) => `${URL_DATABASE}/${endpoint === null || `${endpoint}`}`

interface CALL_SERVER extends CREATE_BODY {
	passJWT?: boolean
}

export async function callServer({
	rootRoute,
	subroute = '/',
	HTTPmethod,
	bodyFields = [],
	passJWT = false
}: CALL_SERVER) {
	try {
		const data = await fetch(GET_DB_ENDPOINT(`${rootRoute}${subroute != '/' && subroute}`), {
			method: HTTPmethod,
			...{ ...(passJWT && { headers: { Authorization: `Bearer ${await getJWT()}` } }) },
			...{ ...CREATE_REQUEST_BODY({ rootRoute, subroute, HTTPmethod, bodyFields }) }
		})
		return await data.json()
	} catch (e) {
		// transform this into a hook or return something else?
		console.log(e)
	}
}
