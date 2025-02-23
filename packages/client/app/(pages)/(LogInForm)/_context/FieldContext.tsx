'use client'

import { ReactNode, useCallback, useRef, useState } from 'react'
import { FieldContext } from './context'

export function GetFieldContext({ children }: { children: ReactNode }) {
	const passwordField = useRef<HTMLInputElement>(null)
	const pwdCompare = useRef<HTMLInputElement>(null)

	const [stateToCompare, setStateToCompare] = useState<boolean>(false)
	const resetComparingState = useCallback(setStateToCompare, [setStateToCompare])

	const [view, setView] = useState<boolean>(false)
	const resetViewState = useCallback(setView, [setView])

	return (
		<FieldContext.Provider
			value={{
				passwordField,
				pwdCompare,

				stateToCompare,
				resetComparingState,

				view,
				resetViewState
			}}
		>
			{children}
		</FieldContext.Provider>
	)
}
