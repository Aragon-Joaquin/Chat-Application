'use client'
import { createContext } from 'react'
import { BadRequest } from '../_errors'

interface ErrorContextInterface {
	UIError: BadRequest | Error | null
	setUIError: (error: BadRequest | Error) => void
}

export const ErrorContext = createContext<ErrorContextInterface>({} as ErrorContextInterface)
