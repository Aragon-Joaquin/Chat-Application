import { HTTP_METHOD } from 'next/dist/server/web/http'
import { getJWT } from './JWTMethods'
import { URL_ENDPOINTS, URL_DATABASE } from './utils.d'
import { CREATE_REQUEST_BODY } from './createBody'

const GET_DB_ENDPOINT = (endpoint: string) => `${URL_DATABASE}/${endpoint === null || `${endpoint}`}`

interface propsCallServer {
	HTTPMethod: HTTP_METHOD
	endpoint: URL_ENDPOINTS
	bodyFields?: (string | number)[]
	passJWT?: boolean
}

export async function callServer({ HTTPMethod, endpoint, bodyFields = [], passJWT = false }: propsCallServer) {
	const [[key, value]] = Object?.entries(endpoint)
	try {
		const finalEndpoint = `${key}${value != '/' && value}`
		const data = await fetch(GET_DB_ENDPOINT(finalEndpoint), {
			method: HTTPMethod,
			...{ ...(passJWT && { headers: { Authorization: `Bearer ${await getJWT()}` } }) },
			...{ ...CREATE_REQUEST_BODY({ HTTPMethod, endpoint: finalEndpoint, data: bodyFields }) }
		})
		return await data.json()
	} catch (e) {
		console.log(e)
	}
}
