'use client'

import { ReactNode, useCallback, useEffect, useReducer, useState } from 'react'
import { RoomContext } from './context'
import { roomReducer } from '../_reducers/roomReducer'
import { initialRoomState, PICK_PAYLOAD, roomState } from '../_reducers/types'
import { useWebsocket } from '../_hooks/useWebsocket'
import { WS_ACTIONS, WS_ENDPOINTS_EVENTS } from '@chat-app/utils/globalConstants'

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
	const { roomState, AddRoom, AddMultipleRooms, AddMessage, LeaveRoom, DeleteMessage } = useRoomReducer()
	const { wsSocket, setWsSocket, handleWSActions } = useWebsocket()
	const [selectedRoom, setSelectedRoom] = useState<roomState>()

	//! could be done in a more 'performant way', like just pointing to the index of the array
	const handleSetState = useCallback(
		(stateID: roomState['roomInfo']['room_id']) => {
			const findRoomInState = roomState.get(stateID)

			if (findRoomInState == undefined) return setSelectedRoom(undefined)
			setSelectedRoom(findRoomInState)
		},
		[roomState]
	)

	useEffect(() => {
		if (wsSocket == undefined) return
		console.log('Socket callback has been executed once again', wsSocket)
		wsSocket.emit(WS_ACTIONS.JOIN_MULTIPLE)

		function handlerMessage(data: string) {
			const { message, roomID } = JSON.parse(data)
			AddMessage({ roomInfo: roomID, newMessage: message })
		}
		wsSocket.on(WS_ENDPOINTS_EVENTS.MESSAGE, handlerMessage)

		return () => {
			wsSocket?.disconnect()
			wsSocket?.off(WS_ENDPOINTS_EVENTS.MESSAGE, handlerMessage)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wsSocket])

	return (
		<RoomContext.Provider
			value={{
				RoomCtx: {
					roomState,
					AddRoom,
					AddMultipleRooms,
					AddMessage,
					LeaveRoom,
					DeleteMessage
				},
				selectedRoom: {
					selectedRoom: selectedRoom,
					setSelectedRoom: handleSetState
				},
				webSocket: {
					wsSocket,
					setWsSocket,
					handleWSActions
				}
			}}
		>
			{children}
		</RoomContext.Provider>
	)
}
