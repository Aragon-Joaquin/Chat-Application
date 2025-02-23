'use client'
import { createContext, Dispatch, RefObject, SetStateAction } from 'react'

interface FieldsInformation {
	passwordField: RefObject<HTMLInputElement | null>
	pwdCompare: RefObject<HTMLInputElement | null>

	stateToCompare: boolean
	resetComparingState: Dispatch<SetStateAction<boolean>>

	view: boolean
	resetViewState: Dispatch<SetStateAction<boolean>>
}

export const FieldContext = createContext<FieldsInformation>({} as FieldsInformation)
