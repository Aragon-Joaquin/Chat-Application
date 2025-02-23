import { useContext } from 'react'
import { FieldContext } from '../_context/context'

export function useFieldContext() {
	const fieldContext = useContext(FieldContext)

	return fieldContext
}
