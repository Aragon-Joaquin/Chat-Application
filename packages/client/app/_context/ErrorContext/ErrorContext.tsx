'use client'

import { ReactNode, useCallback, useState } from 'react'
import { ErrorContext } from './context'
import { BadRequest } from '@/app/_errors'
import { ErrorPopUp } from '@/app/_components/errors/ErrorPopUp.component'

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
