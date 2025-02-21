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
	const values = fields.filter((value) => {
		const data = allFormData.get(value)?.toString()
		return !data ? null : data
	})

	return values.length != fields.length ? null : values
}

export function FDNulls({ fields, currentTargets }: FDTypes) {
	if (!fields.length || !currentTargets) return []

	const allFormData = new FormData(currentTargets)
	return fields.map((value) => {
		const data = allFormData.get(value)?.toString()
		return !data ? null : data
	})
}
