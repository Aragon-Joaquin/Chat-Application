import { BadRequest, BadRequestCodes } from '@/app/_errors'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { callServer } from '@/app/_utils/callServer'
import { FDNoNulls } from '@/app/_utils/FormData'
import { FormEvent } from 'react'

export function useSubmitCredentials() {
	const { makeHTTPRequest } = useCallServer()

	function submitCredentials(
		e: FormEvent<HTMLFormElement>,
		reqInfo: Omit<Parameters<typeof callServer>[0], 'bodyFields'>,
		typedValues?: string[]
	): void {
		const formData = FDNoNulls({
			fields: typedValues != undefined ? typedValues : getFieldsFromInputs(e),
			currentTargets: e?.currentTarget
		})

		if (formData == null) throw new BadRequest('Fields remain empty', BadRequestCodes.BAD_REQUEST)
		makeHTTPRequest({ ...reqInfo, bodyFields: formData })
	}

	return submitCredentials
}

function getFieldsFromInputs(values: FormEvent<HTMLFormElement>) {
	return Array.from(values?.currentTarget)
		.map((value) => {
			return value.getAttribute('name') ?? ''
		})
		.filter((value) => value)
}
