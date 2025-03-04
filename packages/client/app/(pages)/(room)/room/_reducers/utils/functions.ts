import { roomState } from '../types'

export const searchRoom = (state: roomState[], payload: roomState['roomKey']) => {
	if (!state || !payload) return undefined
	return state?.findIndex((room) => room.roomKey === payload)
}
