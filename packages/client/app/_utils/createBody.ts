import { HTTP_METHOD } from 'next/dist/server/web/http'

interface CREATE_REQUEST_BODY {
	HTTPMethod: HTTP_METHOD
	endpoint: string
	data: (string | number)[]
}

const URL_BODY_METHODS = {
	login: {
		GET: ['userName, userPassword']
	},
	//improve this logic later
	'room/roomHistory': {
		GET: ['roomName', 'limit', 'offset']
	}
}

export function CREATE_REQUEST_BODY({ HTTPMethod, endpoint, data }: CREATE_REQUEST_BODY) {
	const endpointURL = URL_BODY_METHODS[endpoint as keyof typeof URL_BODY_METHODS]
	if (`${HTTPMethod}` in endpointURL) return null

	const bodyFields: string[] | [] = endpointURL[HTTPMethod as keyof typeof endpointURL]
	if (bodyFields?.length <= 0) return null

	const arrayOfInformation = bodyFields.map((field, i) => {
		return { [field]: [data[i] ?? null] }
	})

	return { ...{ body: Object.assign({}, ...arrayOfInformation) } }
}
