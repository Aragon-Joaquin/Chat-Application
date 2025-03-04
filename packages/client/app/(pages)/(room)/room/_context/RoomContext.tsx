'use client'

import { ReactNode, useReducer } from 'react'
import { RoomContext } from './context'
import { roomReducer } from '../_reducers/roomReducer'
import { PICK_PAYLOAD, roomState } from '../_reducers/types'

const initialRoomState: roomState[] = []

function useRoomReducer() {
	const [roomState, dispatch] = useReducer(roomReducer, initialRoomState)

	const AddRoom = (payload: PICK_PAYLOAD<'ADD_ROOM'>) =>
		dispatch({
			type: 'ADD_ROOM',
			payload
		})

	const AddMultipleRooms = (payload: PICK_PAYLOAD<'ADD_MULTIPLE_ROOMS'>) =>
		dispatch({
			type: 'ADD_MULTIPLE_ROOMS',
			payload
		})

	const AddMessage = (payload: PICK_PAYLOAD<'ADD_MESSAGE'>) =>
		dispatch({
			type: 'ADD_MESSAGE',
			payload
		})

	const LeaveRoom = (payload: PICK_PAYLOAD<'LEAVE_ROOM'>) =>
		dispatch({
			type: 'LEAVE_ROOM',
			payload
		})

	const DeleteMessage = (payload: PICK_PAYLOAD<'DELETED_MESSAGE'>) =>
		dispatch({
			type: 'DELETED_MESSAGE',
			payload
		})

	return {
		roomState,
		AddRoom,
		AddMultipleRooms,
		AddMessage,
		LeaveRoom,
		DeleteMessage
	}
}

export function GetRoomContext({ children }: { children: ReactNode }) {
	const reducerRoom = useRoomReducer()

	return (
		<RoomContext.Provider
			value={{
				...reducerRoom
			}}
		>
			{children}
		</RoomContext.Provider>
	)
}
