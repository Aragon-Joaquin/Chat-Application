'use client'

import { ReactNode, useCallback, useReducer, useState } from 'react'
import { RoomContext } from './context'
import { roomReducer } from '../_reducers/roomReducer'
import { PICK_PAYLOAD, roomState } from '../_reducers/types'
import { useWebsocket } from '../_hooks/useWebsocket'

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
	const webSocket = useWebsocket()
	const [selectedRoom, setSelectedRoom] = useState<roomState>()

	//! could be done in a more 'performant way', like just pointing to the index of the array
	const handleSetState = useCallback(
		(stateID: roomState['roomInfo']['room_id']) => {
			const findRoomInState = reducerRoom?.roomState?.find((room) => room.roomInfo.room_id === stateID)

			if (findRoomInState == undefined) return setSelectedRoom(undefined)
			setSelectedRoom(findRoomInState)
		},
		[reducerRoom?.roomState]
	)

	return (
		<RoomContext.Provider
			value={{
				...reducerRoom,
				...webSocket,
				selectedRoom,
				setSelectedRoom: handleSetState
			}}
		>
			{children}
		</RoomContext.Provider>
	)
}
