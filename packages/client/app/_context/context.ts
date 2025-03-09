'use client'
import { BadRequest } from '@/app/_errors'
import { createContext } from 'react'

interface ErrorContextInterface {
	UIError: BadRequest | Error | null
	setUIError: (error: BadRequest | Error) => void
}

export const ErrorContext = createContext<ErrorContextInterface>({} as ErrorContextInterface)
