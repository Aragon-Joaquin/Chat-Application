'use client'
import { createContext, Dispatch, SetStateAction } from 'react'
import { PICK_PAYLOAD, roomState } from '../_reducers/types'
import { Socket } from 'socket.io-client'
import { wsPayloads } from '../_hooks/utils/types'
import { WS_ACTIONS } from '@chat-app/utils/globalConstants'

interface RoomContextProps {
	roomState: roomState[]
	AddRoom: (payload: PICK_PAYLOAD<'ADD_ROOM'>) => void
	AddMultipleRooms: (payload: PICK_PAYLOAD<'ADD_MULTIPLE_ROOMS'>) => void
	AddMessage: (payload: PICK_PAYLOAD<'ADD_MESSAGE'>) => void
	LeaveRoom: (payload: PICK_PAYLOAD<'LEAVE_ROOM'>) => void
	DeleteMessage: (payload: PICK_PAYLOAD<'DELETED_MESSAGE'>) => void

	selectedRoom: roomState | undefined
	setSelectedRoom: (stateID: roomState['roomInfo']['room_id']) => void

	wsSocket: Socket | null
	setWsSocket: Dispatch<SetStateAction<Socket | null>>
	HandleWSActions: <T extends keyof typeof WS_ACTIONS>(
		type: Extract<
			wsPayloads,
			{
				action: (typeof WS_ACTIONS)[T]
			}
		>
	) => void
}

export const RoomContext = createContext<RoomContextProps>({} as RoomContextProps)
