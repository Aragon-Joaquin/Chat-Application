import { HTTP_METHOD } from 'next/dist/server/web/http'
import { URL_ENDPOINTS } from './utils'

interface CREATE_REQUEST_BODY {
	HTTPMethod: HTTP_METHOD
	endpoint: URL_ENDPOINTS
	data: (string | number)[]
}

const URL_BODY_METHODS = {
	login: {
		GET: ['userName, userPassword']
	}
}

export function CREATE_REQUEST_BODY({ HTTPMethod, endpoint, data }: CREATE_REQUEST_BODY) {
	const endpointURL = URL_BODY_METHODS[endpoint as keyof typeof URL_BODY_METHODS]
	if (`${HTTPMethod}` in endpointURL) return null

	const bodyFields: string[] | [] = endpointURL[HTTPMethod as keyof typeof endpointURL]
	if (bodyFields?.length <= 0) return null

	const arrayOfInformation = bodyFields.map((field, i) => {
		return { [field]: [data[i]] }
	})

	return { ...{ body: Object.assign({}, ...arrayOfInformation) } }
}
