'use client'

import { useCallServer } from '@/app/_hooks/useCallServer'
import { ReactNode, useEffect } from 'react'

export default function RoomLayout({ children }: { children: ReactNode }) {
	const { makeHTTPRequest, responseData, isPending } = useCallServer()

	useEffect(() => {
		console.log('execute')
		makeHTTPRequest({ rootRoute: '/room', subroute: '/allRooms', passJWT: true, HTTPmethod: 'GET' })
	}, [makeHTTPRequest])

	useEffect(() => {
		console.log(responseData)
	}, [responseData])
	if (isPending) return <>Loading...</>
	console.log('response data: ', responseData)

	return (
		<>
			<h2>Chats loaded</h2>
			{children}
		</>
	)
}
