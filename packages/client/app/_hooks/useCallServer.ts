import { useCallback } from 'react'
import { BadServerRequest } from '../_errors'
import { callServer } from '../_utils/callServer'
import { useConsumeContext } from './consumeContext'

export function useCallServer() {
	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	return useCallback(
		({ rootRoute, subroute, HTTPmethod, bodyFields, passJWT }: Parameters<typeof callServer>[0]) => {
			try {
				return callServer({ rootRoute, subroute, HTTPmethod, bodyFields, passJWT })
			} catch (error) {
				if (error instanceof BadServerRequest) setUIError(error)
				else setUIError(new Error('Unknown Error'))
			}
		},
		[setUIError]
	)
}
