import { RoomInfo } from '@/app/_utils/tableTypes'
import { roomState } from '../types'

export const searchRoom = (state: roomState[], payload: RoomInfo['room_id']) => {
	if (!state || !payload) return undefined
	return state?.findIndex((room) => room.roomInfo['room_id'] === payload)
}
