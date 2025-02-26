'use client'

import { useCallServer } from '@/app/_hooks/useCallServer'
import { ReactNode, useEffect } from 'react'

// {
// 		rootRoute: '/room',
// 		subroute: '/allRooms',
// 		passJWT: true,
// 		HTTPmethod: 'GET'
// 	}

export default function RoomLayout({ children }: { children: ReactNode }) {
	const { responseData, isPending, makeHTTPRequest } = useCallServer()

	console.log(responseData)

	if (isPending) return <>Loading...</>

	return (
		<>
			<h2>Chats loaded</h2>
			{children}
			<button
				onClick={() =>
					makeHTTPRequest({
						rootRoute: '/room',
						subroute: '/allRooms',
						passJWT: true,
						HTTPmethod: 'GET'
					})
				}
			>
				asdasdasddasasddas
			</button>
		</>
	)
}
