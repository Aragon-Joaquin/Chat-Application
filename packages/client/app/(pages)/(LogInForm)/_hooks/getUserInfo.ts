import { useCallServer } from '@/app/_hooks/useCallServer'
import { LOGIN_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { UserInfo } from '@/app/_utils/tableTypes'
import { useCallback, useEffect, useState } from 'react'

export function useGetUserInfo() {
	const { makeHTTPRequest, responseData } = useCallServer<LOGIN_TYPES_RESPONSES['/getUser']>()
	const [getUserInfo, setUserInfo] = useState<UserInfo | null>(null)

	const makeUserInfo = useCallback(() => {
		makeHTTPRequest({ rootRoute: '/login', subroute: '/getUser', HTTPmethod: 'GET', passJWT: true })
	}, [makeHTTPRequest])

	useEffect(() => {
		console.log({ works: responseData })
		if (responseData == null) return
		setUserInfo(responseData)
	}, [responseData])

	return {
		makeUserInfo,
		getUserInfo
	}
}
