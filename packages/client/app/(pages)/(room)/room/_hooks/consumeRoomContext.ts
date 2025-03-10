'use client'

import { useContext } from 'react'
import { RoomContext } from '../_context/context'

export function useRoomContext() {
	const roomCtx = useContext(RoomContext)

	return {
		...roomCtx
	}
}
