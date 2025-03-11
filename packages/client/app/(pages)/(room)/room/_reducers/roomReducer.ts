import { initialRoomState, PAYLOAD_TYPES, PICK_PAYLOAD, roomState, STATE_ACTIONS } from './types'

const roomStateActions = {
	[STATE_ACTIONS.ADD_ROOM]: function ({
		state,
		payload
	}: {
		state: typeof initialRoomState
		payload: PICK_PAYLOAD<'ADD_ROOM'>
	}) {
		if (state.get(payload['room_id']) == undefined) return state
		return new Map([...state, ...state.set(payload['room_id'], { roomInfo: payload, messages: [] })])
	},

	[STATE_ACTIONS.ADD_MULTIPLE_ROOMS]: function ({
		state,
		payload
	}: {
		state: typeof initialRoomState
		payload: PICK_PAYLOAD<'ADD_MULTIPLE_ROOMS'>
	}) {
		if (!payload || !payload?.length) return state

		const filteredRoom: Map<string, roomState> = new Map()

		payload.forEach((roomState) => {
			const {
				roomInfo: { room_id }
			} = roomState
			const getRoom = state?.get(room_id)
			if (getRoom != undefined) return
			filteredRoom.set(room_id, roomState)
		})

		return new Map([...state, ...filteredRoom])
	},

	[STATE_ACTIONS.ADD_MESSAGE]: function ({
		state,
		payload
	}: {
		state: typeof initialRoomState
		payload: PICK_PAYLOAD<'ADD_MESSAGE'>
	}) {
		const { roomInfo, newMessage } = payload
		const roomCode = state.get(roomInfo)

		if (roomCode == undefined) return state

		return new Map([
			...state,
			...state.set(roomInfo, {
				roomInfo: roomCode['roomInfo'],
				messages: [...roomCode['messages'], { ...newMessage, messageStatus: 'loading' }]
			})
		])
	},

	[STATE_ACTIONS.LEAVE_ROOM]: function ({
		state,
		payload
	}: {
		state: typeof initialRoomState
		payload: PICK_PAYLOAD<'LEAVE_ROOM'>
	}) {
		const { room_id } = payload

		const roomCode = state.get(room_id)
		if (roomCode == undefined) return state

		try {
			const mappedRooms = new Map(state)
			if (mappedRooms.delete(room_id)) return mappedRooms
			return state
		} catch {
			return state
		}
	},

	[STATE_ACTIONS.DELETED_MESSAGE]: function ({
		state,
		payload
	}: {
		state: typeof initialRoomState
		payload: PICK_PAYLOAD<'DELETED_MESSAGE'>
	}) {
		const { roomInfo, message } = payload
		const roomCode = state.get(roomInfo['room_id'])

		if (roomCode == undefined) return state

		return new Map([
			...state,
			...state.set(roomInfo['room_id'], {
				roomInfo: roomCode['roomInfo'],
				messages: roomCode['messages'].filter((msg) => msg.message_id != message.message_id)
			})
		])
	}
}

export function roomReducer(state: typeof initialRoomState, action: PAYLOAD_TYPES) {
	const { type, payload } = action
	const grabActionFunc = roomStateActions[type]

	if (grabActionFunc == undefined) return state
	return grabActionFunc({ state, payload: payload as keyof Parameters<typeof grabActionFunc>[0]['payload'] })
}
