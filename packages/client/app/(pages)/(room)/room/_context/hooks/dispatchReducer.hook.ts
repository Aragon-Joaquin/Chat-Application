import { useReducer } from 'react'
import { roomReducer } from '../../_reducers/roomReducer/roomReducer'
import { initialRoomState, PICK_PAYLOAD } from '../../_reducers/roomReducer/types'

export function useRoomReducer() {
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

	const AddOwnMessage = (payload: PICK_PAYLOAD<'ADD_OWN_MESSAGE'>) =>
		dispatch({
			type: 'ADD_OWN_MESSAGE',
			payload
		})

	const ModifyMessage = (payload: PICK_PAYLOAD<'MODIFY_MESSAGE'>) =>
		dispatch({
			type: 'MODIFY_MESSAGE',
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
		AddOwnMessage,
		ModifyMessage,
		LeaveRoom,
		DeleteMessage
	}
}
