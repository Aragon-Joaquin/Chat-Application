import { BadRequest, BadRequestCodes } from '@/app/_errors'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { callServer } from '@/app/_utils/callServer'
import { FDNoNulls } from '@/app/_utils/FormData'
import { FormEvent } from 'react'

export function useSubmitCredentials() {
	const { makeHTTPRequest } = useCallServer()

	async function submitCredentials(e: FormEvent<HTMLFormElement>, reqInfo: Parameters<typeof callServer>[0]) {
		const fieldsFromInputs = Array.from(e?.currentTarget)
			.map((value) => {
				return value.getAttribute('name') ?? ''
			})
			.filter((value) => value)
		const formData = FDNoNulls({ fields: fieldsFromInputs, currentTargets: e?.currentTarget })
		if (formData == null) throw new BadRequest('Fields remain empty', BadRequestCodes.BAD_REQUEST)
		makeHTTPRequest(reqInfo)
	}

	return submitCredentials
}
