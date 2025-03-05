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
		}
	}
}
