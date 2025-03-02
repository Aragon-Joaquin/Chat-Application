'use client'
import { createContext } from 'react'
import { PICK_PAYLOAD, roomState } from '../_reducers/types'

interface RoomContextProps {
	roomState: roomState[]
	AddRoom: (payload: PICK_PAYLOAD<'ADD_ROOM'>) => void
}

export const RoomContext = createContext<RoomContextProps>({} as RoomContextProps)
