import { useContext } from 'react'
import { ErrorContext } from '../_context/context'

export function useConsumeContext() {
	const errorCtx = useContext(ErrorContext)

	return {
		ErrorContext: { ...errorCtx }
	}
}
