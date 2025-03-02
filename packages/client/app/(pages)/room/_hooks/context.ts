'use client'
import { createContext } from 'react'
import { reducerActions, roomState } from '../_reducers/types'

interface RoomContextProps {
	roomState: roomState[]
	AddRoom: (payload: reducerActions['payload']) => void
}

export const RoomContext = createContext<RoomContextProps>({} as RoomContextProps)
