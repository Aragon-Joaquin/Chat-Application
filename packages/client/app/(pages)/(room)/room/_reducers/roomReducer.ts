import { initialRoomState, PAYLOAD_TYPES, PICK_PAYLOAD, roomState, STATE_ACTIONS, UUID_CLIENT_GENERATED } from './types'

const roomStateActions = {
	[STATE_ACTIONS.ADD_ROOM]: function ({
		state,
		payload
	}: {
		state: typeof initialRoomState
		payload: PICK_PAYLOAD<'ADD_ROOM'>
	}) {
		if (state.get(payload['room_id']) == undefined) return state
		return new Map(state).set(payload['room_id'], { roomInfo: payload, messages: [] })
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
	[STATE_ACTIONS.ADD_OWN_MESSAGE]: function ({
		state,
		payload
	}: {
		state: typeof initialRoomState
		payload: PICK_PAYLOAD<'ADD_OWN_MESSAGE'>
	}) {
		const { roomInfo, ownMessage } = payload
		const roomCode = state.get(roomInfo)

		if (roomCode == undefined) return state
		return new Map(state).set(roomInfo, {
			roomInfo: roomCode['roomInfo'],
			messages: [
				...roomCode['messages'],
				{
					message_content: ownMessage.message_content,
					date_sended: '',
					message_id: `${crypto.randomUUID()}${UUID_CLIENT_GENERATED}`,
					file_id: null,
					messageStatus: 'loading',
					own_message: true,
					profile_picture: null,
					which_room: roomInfo
				}
			]
		})
	},

	[STATE_ACTIONS.MODIFY_MESSAGE]: function ({
		state,
		payload
	}: {
		state: typeof initialRoomState
		payload: PICK_PAYLOAD<'MODIFY_MESSAGE'>
	}) {
		const {
			message: { message_id, messageStatus, own_message, message_content, date_sended },
			roomInfo,
			client_id
		} = payload
		const roomCode = state.get(roomInfo)

		if (roomCode == undefined) return state

		const findMessageByID = !roomCode['messages'].length
			? undefined
			: roomCode['messages'].findIndex((msgInfo) => {
					if (own_message == true) return msgInfo.message_id === client_id
					return msgInfo.message_id === message_id
				})

		if (findMessageByID == undefined) return state

		return new Map(state).set(roomInfo, {
			roomInfo: roomCode['roomInfo'],
			messages: [
				...roomCode['messages'].slice(0, findMessageByID),
				{
					...roomCode['messages'][findMessageByID],
					...(message_content != null && { message_content }),
					...(messageStatus != null && { messageStatus }),
					...(date_sended != null && { date_sended })
				},
				...roomCode['messages'].slice(findMessageByID, roomCode['messages'].length)
			]
		})
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

		return new Map(state).set(roomInfo, {
			roomInfo: roomCode['roomInfo'],
			messages: [...roomCode['messages'], { ...newMessage }]
		})
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

		return new Map(state).set(roomInfo['room_id'], {
			roomInfo: roomCode['roomInfo'],
			messages: roomCode['messages'].filter((msg) => msg.message_id != message.message_id)
		})
	}
}

export function roomReducer(state: typeof initialRoomState, action: PAYLOAD_TYPES) {
	const { type, payload } = action
	const grabActionFunc = roomStateActions[type]

	if (grabActionFunc == undefined) return state
	return grabActionFunc({ state, payload: payload as keyof Parameters<typeof grabActionFunc>[0]['payload'] })
}
