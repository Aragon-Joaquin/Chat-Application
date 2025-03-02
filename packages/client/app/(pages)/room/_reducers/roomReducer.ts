import { PAYLOAD_TYPES, PICK_PAYLOAD, roomState, STATE_ACTIONS } from './types'
import { searchRoom } from './utils/functions'

const roomStateActions = {
	[STATE_ACTIONS.ADD_ROOM]: function ({ state, payload }: { state: roomState[]; payload: PICK_PAYLOAD<'ADD_ROOM'> }) {
		if (searchRoom(state, payload) == undefined) return state
		return [...state, { roomKey: payload, messages: [] }]
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
		const roomCode = searchRoom(state, payload)
		if (roomCode == undefined) return state

		return state.filter((room) => room.roomKey != state[roomCode].roomKey)
	},

	[STATE_ACTIONS.DELETED_MESSAGE]: function ({
		state,
		payload
	}: {
		state: roomState[]
		payload: PICK_PAYLOAD<'DELETED_MESSAGE'>
	}) {
		const { roomInfo, message } = payload
		const roomCode = searchRoom(state, roomInfo)
		if (roomCode == undefined) return state

		const findMessage = state[roomCode].messages.filter((stateMsg) => stateMsg.messageID !== message.messageID)
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

	// i have no idea what did i just do
	return grabActionFunc({ state, payload: payload as keyof Parameters<typeof grabActionFunc>[0]['payload'] })
}
