//! this needs function overloading.
// FD stands for formData

interface FDTypes {
	fields: string[]
	currentTargets: EventTarget & HTMLFormElement
}

/**
 * @description the function gives null is the fields are not the same length, otherwise returns true
 */
export function FDNoNulls({ fields, currentTargets }: FDTypes): string[] | null {
	if (!fields.length || !currentTargets) return []

	const allFormData = new FormData(currentTargets)
	const values: string[] = []

	fields.forEach((data) => {
		const dataField = allFormData.get(data)
		return dataField && values.push(dataField.toString())
	})

	if (values.length != fields.length) return null
	return values
}

// export function FDNulls
