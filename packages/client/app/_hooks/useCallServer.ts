import { useCallback, useState, useTransition } from 'react'
import { BadRequest } from '../_errors'
import { callServer } from '../_utils/callServer'
import { useConsumeContext } from './consumeContext'

export function useCallServer() {
	const [isPending, startTransition] = useTransition()
	const [responseData, setResponseData] = useState<unknown | null>(null)

	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	const makeHTTPRequest = useCallback(
		({ rootRoute, subroute, HTTPmethod, bodyFields, passJWT }: Parameters<typeof callServer>[0]) => {
			startTransition(async () => {
				try {
					const response = await callServer({ rootRoute, subroute, HTTPmethod, bodyFields, passJWT })
					if (response?.statusCode != 200) throw new BadRequest(response?.message, response.statusCode)
					setResponseData(response)
				} catch (error) {
					if (error instanceof BadRequest) setUIError(error)
					else setUIError(new Error("Unexpected error from server. We're working on it."))
				}
			})
		},
		[setUIError]
	)

	return {
		makeHTTPRequest,
		isPending,
		responseData
	}
}
