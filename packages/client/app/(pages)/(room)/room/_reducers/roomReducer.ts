import { PAYLOAD_TYPES, PICK_PAYLOAD, roomState, STATE_ACTIONS } from './types'
import { searchRoom } from './utils/functions'

const roomStateActions = {
	[STATE_ACTIONS.ADD_ROOM]: function ({ state, payload }: { state: roomState[]; payload: PICK_PAYLOAD<'ADD_ROOM'> }) {
		if (searchRoom(state, payload['room_id']) == undefined) return state
		return [...state, { roomInfo: payload, messages: [] }]
	},

	[STATE_ACTIONS.ADD_MULTIPLE_ROOMS]: function ({
		state,
		payload
	}: {
		state: roomState[]
		payload: PICK_PAYLOAD<'ADD_MULTIPLE_ROOMS'>
	}) {
		if (!payload) return state
		const excludeRepeatedRoom: roomState[] = payload.flatMap((room) => {
			const existRoom =
				state?.length > 0
					? state.some((exists) => {
							return exists.roomInfo.room_id === room.roomInfo.room_id
						})
					: false

			if (existRoom) return []
			return { roomInfo: room.roomInfo, messages: room?.messages ?? [] }
		})

		return [...state, ...excludeRepeatedRoom]
	},

	[STATE_ACTIONS.ADD_MESSAGE]: function ({
		state,
		payload
	}: {
		state: roomState[]
		payload: PICK_PAYLOAD<'ADD_MESSAGE'>
	}) {
		const { roomInfo, newMessage } = payload
		const roomCode = searchRoom(state, roomInfo)

		if (roomCode == undefined) return state

		return [
			...state.slice(0, roomCode),
			{ ...state[roomCode], messages: [...state[roomCode].messages, ...newMessage] },
			...state.slice(roomCode, state.length)
		]
	},

	[STATE_ACTIONS.LEAVE_ROOM]: function ({
		state,
		payload
	}: {
		state: roomState[]
		payload: PICK_PAYLOAD<'LEAVE_ROOM'>
	}) {
		const roomCode = searchRoom(state, payload['room_id'])
		if (roomCode == undefined) return state

		return state.filter((room) => room.roomInfo['room_id'] != state[roomCode].roomInfo['room_id'])
	},

	[STATE_ACTIONS.DELETED_MESSAGE]: function ({
		state,
		payload
	}: {
		state: roomState[]
		payload: PICK_PAYLOAD<'DELETED_MESSAGE'>
	}) {
		const { roomInfo, message } = payload
		const roomCode = searchRoom(state, roomInfo['room_id'])
		if (roomCode == undefined) return state

		const findMessage = state[roomCode].messages.filter((stateMsg) => stateMsg.message_id !== message.message_id)
		return [
			...state.slice(0, roomCode),
			{ ...state[roomCode], messages: findMessage },
			...state.slice(roomCode, state.length)
		]
	}
}

export function roomReducer(state: roomState[], action: PAYLOAD_TYPES) {
	const { type, payload } = action
	const grabActionFunc = roomStateActions[type]

	if (grabActionFunc == undefined) return state
	return grabActionFunc({ state, payload: payload as keyof Parameters<typeof grabActionFunc>[0]['payload'] })
}
