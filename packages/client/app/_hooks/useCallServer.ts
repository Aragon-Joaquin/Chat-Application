import { useCallback, useTransition } from 'react'
import { BadRequest } from '../_errors'
import { callServer } from '../_utils/callServer'
import { useConsumeContext } from './consumeContext'

export function useCallServer() {
	const [isPending, startTransition] = useTransition()

	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	//! i think i might use a useState
	const makeHTTPRequest = useCallback(
		({ rootRoute, subroute, HTTPmethod, bodyFields, passJWT }: Parameters<typeof callServer>[0]) => {
			startTransition(async () => {
				try {
					const response = await callServer({ rootRoute, subroute, HTTPmethod, bodyFields, passJWT })
					if (response?.statusCode != 200) throw new BadRequest(response?.message, response.statusCode)
					return response
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
		isPending
	}
}
