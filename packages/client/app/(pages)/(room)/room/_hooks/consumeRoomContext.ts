'use client'

import { useContext } from 'react'
import { RoomContext } from '../_context/context'

export function useRoomContext() {
	const RoomValues = useContext(RoomContext)

	return {
		RoomCtx: RoomValues
	}
}
