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

	return {
		roomState,
		AddRoom
	}
}

export function GetRoomContext({ children }: { children: ReactNode }) {
	const { roomState, AddRoom } = useRoomReducer()

	return (
		<RoomContext.Provider
			value={{
				roomState,
				AddRoom
			}}
		>
			{children}
		</RoomContext.Provider>
	)
}
