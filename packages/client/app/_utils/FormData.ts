//! this needs function overloading.
// FD stands for formData

import { FormEvent } from 'react'

interface FDTypes {
	fields: string[]
	currentTargets: EventTarget & HTMLFormElement
	acceptNulls?: boolean | null
}

/**
 * @description the function gives null is the fields are not the same length, otherwise returns true
 */
export function getAllFormsData({ fields, currentTargets, acceptNulls }: FDTypes): string[] | null {
	if (!fields.length || !currentTargets) return []

	const allFormData = new FormData(currentTargets)
	const values: string[] = []

	fields.forEach((data) => {
		const dataField = allFormData.get(data)
		if (acceptNulls) return values.push(String(dataField ?? ''))
		return dataField && values.push(String(dataField))
	})

	if (values.length != fields.length) return null
	return values
}

export function getFieldsFromInputs(values: FormEvent<HTMLFormElement>) {
	return Array.from(values?.currentTarget)
		.map((value) => {
			return value.getAttribute('name') ?? ''
		})
		.filter((value) => value)
}
