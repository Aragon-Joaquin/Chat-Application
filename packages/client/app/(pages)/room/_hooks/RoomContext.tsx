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
		AddMessage,
		LeaveRoom,
		DeleteMessage
	}
}

export function GetRoomContext({ children }: { children: ReactNode }) {
	const { roomState, AddRoom, AddMessage, LeaveRoom, DeleteMessage } = useRoomReducer()

	return (
		<RoomContext.Provider
			value={{
				roomState,
				AddRoom,
				AddMessage,
				LeaveRoom,
				DeleteMessage
			}}
		>
			{children}
		</RoomContext.Provider>
	)
}
