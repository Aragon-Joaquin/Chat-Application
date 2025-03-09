'use client'

import { ReactNode, useCallback, useState } from 'react'
import { ErrorContext } from './context'
import { ErrorPopUp } from '../_components/errors/ErrorPopUp.component'
import { BadRequest } from '../_errors'

export function GetErrorContext({ children }: { children: ReactNode }) {
	const [UIError, setUIError] = useState<BadRequest | Error | null>(null)
	const handleErrorState = useCallback((error: BadRequest | Error) => {
		setUIError(error)
	}, [])

	return (
		<ErrorContext.Provider
			value={{
				UIError,
				setUIError: handleErrorState
			}}
		>
			{children}
			{UIError != null && <ErrorPopUp error={UIError} onErrorClick={setUIError} />}
		</ErrorContext.Provider>
	)
}
