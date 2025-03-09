import { BadRequest, BadRequestCodes } from '@/app/_errors'
import { useConsumeContext } from '@/app/_hooks/consumeContext'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { LOGIN_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { callServer } from '@/app/_utils/callServer'
import { getAllFormsData, getFieldsFromInputs } from '@/app/_utils/FormData'
import { getJWT, setJWT } from '@/app/_utils/JWTMethods'
import { FormEvent, useEffect, useState } from 'react'

export function useSubmitCredentials() {
	const { makeHTTPRequest, responseData } = useCallServer<LOGIN_TYPES_RESPONSES['/']>()
	const [hasToken, setHasToken] = useState<boolean>(false)
	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	async function submitCredentials(
		e: FormEvent<HTMLFormElement>,
		reqInfo: Omit<Parameters<typeof callServer>[0], 'bodyFields'>,
		typedValues?: string[]
	): Promise<void> {
		const formData = getAllFormsData({
			fields: typedValues != undefined ? typedValues : getFieldsFromInputs(e),
			currentTargets: e?.currentTarget,
			acceptNulls: false
		})

		if (formData == null) throw new BadRequest('Fields remain empty', BadRequestCodes.BAD_REQUEST)

		if ((await getJWT()) != null) return setUIError(new Error("You're already logged in!"))
		makeHTTPRequest({ ...reqInfo, bodyFields: formData })
	}

	useEffect(() => {
		async function setJWTInCookies(token: LOGIN_TYPES_RESPONSES['/']) {
			if ((await getJWT()) != null) return
			await setJWT(token.access_token)
			setHasToken(true)
		}
		if (responseData != null && 'access_token' in responseData) setJWTInCookies(responseData)
	}, [responseData])

	return { submitCredentials, hasToken }
}
