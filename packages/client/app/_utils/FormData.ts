export class CustomFormData {
	private fields: string[]
	private currentTargets: EventTarget & HTMLFormElement
	public formGetData: (string | null)[] = []

	constructor(fields: string[], currentTargets: EventTarget & HTMLFormElement) {
		this.fields = fields
		this.currentTargets = currentTargets
	}

	getFormData() {
		if (!this.fields.length || !this.currentTargets) return []

		const allFormData = new FormData(this.currentTargets)
		const values = this.fields.map((value) => {
			const data = allFormData.get(value)?.toString()
			return !data ? null : data
		})

		this.formGetData = values
	}

	formDataHasNulls() {
		if (this.formGetData == undefined) return true
		return this.formGetData.some((value) => (value == null ? true : false))
	}
}
