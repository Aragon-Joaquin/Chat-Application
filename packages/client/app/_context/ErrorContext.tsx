import { ReactNode, useCallback, useState } from 'react'
import { ErrorPopUp } from '../_components/ErrorPopUp.component'
import { BadServerRequest } from '../_errors'
import { ErrorContext } from './context'

export function GetErrorContext({ children }: { children: ReactNode }) {
	const [UIError, setUIError] = useState<BadServerRequest | null>(null)
	const handleSubmit = useCallback(() => {
		setUIError(null)
	}, [])

	return (
		<ErrorContext.Provider
			value={{
				UIError,
				setUIError: handleSubmit
			}}
		>
			{children}
			{UIError != null && <ErrorPopUp error={UIError} onErrorClick={handleSubmit} />}
		</ErrorContext.Provider>
	)
}
