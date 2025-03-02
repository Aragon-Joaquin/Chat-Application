'use client'
import { createContext } from 'react'
import { PICK_PAYLOAD, roomState } from '../_reducers/types'

interface RoomContextProps {
	roomState: roomState[]
	AddRoom: (payload: PICK_PAYLOAD<'ADD_ROOM'>) => void
	AddMessage: (payload: PICK_PAYLOAD<'ADD_MESSAGE'>) => void
	LeaveRoom: (payload: PICK_PAYLOAD<'LEAVE_ROOM'>) => void
	DeleteMessage: (payload: PICK_PAYLOAD<'DELETED_MESSAGE'>) => void
}

export const RoomContext = createContext<RoomContextProps>({} as RoomContextProps)
