'use client'

import { ReactNode, useEffect } from 'react'
import { GetRoomContext } from './room/_context/RoomContext'
import { useWebsocket } from './room/_hooks/useWebsocket'
import { createSocket } from '@/app/_utils/WsFunc/wsCalls'

export default function RoomContext({ children }: { children: ReactNode }) {
	const { wsSocket, setWsSocket } = useWebsocket()

	useEffect(() => {
		async function makeSocket() {
			const socket = await createSocket()
			setWsSocket(socket)
		}
		if (wsSocket == undefined) makeSocket()
	}, [setWsSocket, wsSocket])

	return <GetRoomContext>{children}</GetRoomContext>
}
