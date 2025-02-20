import { createContext } from 'react'
import { BadServerRequest } from '../_errors'

interface ErrorContextInterface {
	UIError: BadServerRequest | null
	setUIError: (error: BadServerRequest | null | Error) => void
}

export const ErrorContext = createContext<ErrorContextInterface>({} as ErrorContextInterface)
