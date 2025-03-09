'use client'

import { useContext } from 'react'
import { RoomContext } from '../_context/context'

export function useRoomContext() {
	const RoomCtx = useContext(RoomContext)

	return {
		RoomCtx,
		selectedRoom: {
			selectedRoom: RoomCtx.selectedRoom,
			setSelectedRoom: RoomCtx.setSelectedRoom
		},
		webSocket: {
			wsSocket: RoomCtx.wsSocket,
			setWsSocket: RoomCtx.setWsSocket,
			handleWSActions: RoomCtx.HandleWSActions
		}
	}
}
