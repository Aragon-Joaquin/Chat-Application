import { useContext } from 'react'
import { ErrorContext } from '../_context'

export function useConsumeContext() {
	const errorCtx = useContext(ErrorContext)

	return {
		ErrorContext: { ...errorCtx }
	}
}
