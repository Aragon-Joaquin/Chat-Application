'use client'

import { ReactNode, useEffect } from 'react'
import { GetRoomContext } from './room/_context/RoomContext'
import { useWebsocket } from './room/_hooks/useWebsocket'
import { createSocket } from '@/app/(pages)/(room)/room/_hooks/utils/wsCalls'
import { useGetUserInfo } from '../(LogInForm)/_hooks/getUserInfo'

export default function RoomContext({ children }: { children: ReactNode }) {
	const { wsSocket, setWsSocket } = useWebsocket()
	const { makeUserInfo } = useGetUserInfo()

	useEffect(() => {
		makeUserInfo()
	}, [makeUserInfo])

	useEffect(() => {
		async function makeSocket() {
			const socket = await createSocket()
			setWsSocket(socket)
		}
		if (wsSocket == undefined) makeSocket()
	}, [setWsSocket, wsSocket, makeUserInfo])

	return <GetRoomContext>{children}</GetRoomContext>
}
