import { BadRequest, BadRequestCodes } from '@/app/_errors'
import { useConsumeContext } from '@/app/_hooks/consumeContext'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { callServer } from '@/app/_utils/callServer'
import { FDNoNulls } from '@/app/_utils/FormData'
import { getJWT, setJWT } from '@/app/_utils/JWTMethods'
import { FormEvent, useEffect, useState } from 'react'

function getFieldsFromInputs(values: FormEvent<HTMLFormElement>) {
	return Array.from(values?.currentTarget)
		.map((value) => {
			return value.getAttribute('name') ?? ''
		})
		.filter((value) => value)
}

export function useSubmitCredentials() {
	const { makeHTTPRequest, responseData } = useCallServer()
	const [hasToken, setHasToken] = useState<boolean>(false)
	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	async function submitCredentials(
		e: FormEvent<HTMLFormElement>,
		reqInfo: Omit<Parameters<typeof callServer>[0], 'bodyFields'>,
		typedValues?: string[]
	): Promise<void> {
		const formData = FDNoNulls({
			fields: typedValues != undefined ? typedValues : getFieldsFromInputs(e),
			currentTargets: e?.currentTarget
		})

		if (formData == null) throw new BadRequest('Fields remain empty', BadRequestCodes.BAD_REQUEST)

		if ((await getJWT()) != null) return setUIError(new Error("You're already logged in!"))
		makeHTTPRequest({ ...reqInfo, bodyFields: formData })
	}

	useEffect(() => {
		async function setJWTInCookies(token: string) {
			if ((await getJWT()) != null) return
			await setJWT(token)
			setHasToken(true)
		}
		if (responseData != null && 'access_token' in responseData) setJWTInCookies(responseData.access_token as string)
	}, [responseData])

	return { submitCredentials, hasToken }
}
