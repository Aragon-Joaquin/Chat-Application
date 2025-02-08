import { HTTP_METHOD } from 'next/dist/server/web/http'
import { getJWT } from './JWTMethods'
import { URL_ENDPOINTS, URL_DATABASE } from './utils.d'
import { CREATE_REQUEST_BODY } from './createBody'

const GET_DB_ENDPOINT = (endpoint: URL_ENDPOINTS | null) => `${URL_DATABASE}${endpoint === null || `/${endpoint}`}`

interface propsCallServer {
	HTTPMethod: HTTP_METHOD
	endpoint: URL_ENDPOINTS
	bodyFields?: (string | number)[]
	passJWT?: boolean
}

export async function callServer({ HTTPMethod, endpoint, bodyFields = [], passJWT = false }: propsCallServer) {
	try {
		const data = await fetch(GET_DB_ENDPOINT(endpoint), {
			method: HTTPMethod,
			...{ ...(passJWT && { headers: { Authorization: `Bearer ${await getJWT()}` } }) },
			...{ ...CREATE_REQUEST_BODY({ HTTPMethod, endpoint, data: bodyFields }) }
		})
		return await data.json()
	} catch (e) {
		console.log(e)
	}
}
