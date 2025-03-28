'use client'

import { ReactNode, useEffect } from 'react'
import { GetRoomContext } from './room/_context/RoomContext'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { USER_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { DELETESessionStorage, SETSessionStorage } from '@/app/_utils/sessionStorage'

export default function RoomContext({ children }: { children: ReactNode }) {
	const { makeHTTPRequest, responseData } = useCallServer<USER_TYPES_RESPONSES['/']>()
	//get session token
	useEffect(() => {
		makeHTTPRequest({ rootRoute: '/user', subroute: '/', passJWT: true, HTTPmethod: 'GET' })
	}, [makeHTTPRequest])

	useEffect(() => {
		if (responseData == undefined) return
		SETSessionStorage(responseData)

		return () => {
			DELETESessionStorage()
		}
	}, [responseData])

	return <GetRoomContext>{children}</GetRoomContext>
}
