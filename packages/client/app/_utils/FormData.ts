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

	allFormData.forEach((data) => {
		return data && values.push(data.toString())
	})

	return values.length != fields.length ? null : values
}

// export function FDNulls
