'use client'

import { createContext, Dispatch, SetStateAction } from 'react'
import { initialReducerState, PICK_PAYLOAD, roomState } from '../_reducers/types'
import { Socket } from 'socket.io-client'
import { wsPayloads } from '../_hooks/utils/types'
import { WS_ACTIONS } from '@chat-app/utils/globalConstants'
import { UserInfo } from '@/app/_utils/tableTypes'

interface RoomCtx {
	roomState: (typeof initialReducerState)['rooms']
	userState: (typeof initialReducerState)['users']
	AddRoom: (payload: PICK_PAYLOAD<'ADD_ROOM'>) => void
	AddMultipleRooms: (payload: PICK_PAYLOAD<'ADD_MULTIPLE_ROOMS'>) => void
	AddMessage: (payload: PICK_PAYLOAD<'ADD_MESSAGE'>) => void
	AddOwnMessage: (payload: PICK_PAYLOAD<'ADD_OWN_MESSAGE'>) => void
	ModifyMessage: (payload: PICK_PAYLOAD<'MODIFY_MESSAGE'>) => void
	LeaveRoom: (payload: PICK_PAYLOAD<'LEAVE_ROOM'>) => void
	DeleteMessage: (payload: PICK_PAYLOAD<'DELETED_MESSAGE'>) => void
}
interface selectedRoom {
	selectedKeyRoom: string | undefined
	setSelectedKeyRoom: (stateID: roomState['roomInfo']['room_id']) => void
}

interface currentUser {
	currentUser: UserInfo['user_id'] | undefined
	setCurrentUser: Dispatch<SetStateAction<UserInfo['user_id'] | undefined>>
}

interface webSocket {
	wsSocket: Socket | null
	setWsSocket: Dispatch<SetStateAction<Socket | null>>
	handleWSActions: <T extends keyof typeof WS_ACTIONS>(
		type: Extract<
			wsPayloads,
			{
				action: (typeof WS_ACTIONS)[T]
			}
		>
	) => void
}

//! this is what the context uses
interface RoomContextProps {
	RoomCtx: RoomCtx
	selectedRoom: selectedRoom
	currentUser: currentUser
	webSocket: webSocket
}

export const RoomContext = createContext<RoomContextProps>({} as RoomContextProps)
