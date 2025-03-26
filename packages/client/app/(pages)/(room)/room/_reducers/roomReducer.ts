import { initialReducerState, PAYLOAD_TYPES, PICK_PAYLOAD, roomState, STATE_ACTIONS } from './types'
import { ADD_USERS_MAP, CREATE_MESSAGE_OBJ_WITH_FALLBACK } from './utils'

const roomStateActions = {
	[STATE_ACTIONS.MODIFY_USERINFO]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'MODIFY_USERINFO'>
	}) {
		const { userID, newProps } = payload
		const { users } = state

		const userFound = users.get(userID)
		if (!userFound) return state
		return {
			...state,
			user: new Map(users).set(userID, {
				...userFound,
				...newProps
			})
		}
	},
	[STATE_ACTIONS.ADD_ROOM]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'ADD_ROOM'>
	}) {
		const { rooms } = state
		if (rooms.get(payload['room_id']) != undefined) return state
		return {
			...state,
			rooms: new Map(rooms).set(payload['room_id'], { roomInfo: payload, messages: [] })
		}
	},

	[STATE_ACTIONS.ADD_MULTIPLE_ROOMS]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'ADD_MULTIPLE_ROOMS'>
	}) {
		console.log({ payload })
		if (!payload || !payload?.length) return state
		const { rooms, users } = state

		const filteredRoom: Map<string, roomState> = new Map()

		payload.forEach(({ roomInfo: roomProps }) => {
			const { roomInfo } = roomProps
			const getRoom = rooms?.get(roomInfo['room_id'])
			if (getRoom != undefined) return
			filteredRoom.set(roomInfo['room_id'], roomProps)
		})

		return {
			rooms: new Map([...rooms, ...filteredRoom]),
			users: ADD_USERS_MAP(
				payload.map((user) => user['userInfo']),
				users
			)
		}
	},
	[STATE_ACTIONS.ADD_OWN_MESSAGE]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'ADD_OWN_MESSAGE'>
	}) {
		const { roomInfo, ownMessage, client_id } = payload
		const { rooms } = state

		const roomCode = rooms.get(roomInfo)

		if (roomCode == undefined || client_id == undefined) return state
		return {
			...state,
			rooms: new Map(rooms).set(roomInfo, {
				roomInfo: roomCode['roomInfo'],
				messages: [
					...roomCode['messages'],
					{
						...CREATE_MESSAGE_OBJ_WITH_FALLBACK({
							...ownMessage,
							message_id: client_id,
							which_room: roomInfo,
							own_message: true
						}),
						messageStatus: 'loading'
					}
				]
			})
		}
	},

	[STATE_ACTIONS.MODIFY_MESSAGE]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'MODIFY_MESSAGE'>
	}) {
		const { message, roomInfo, client_id } = payload
		const { rooms } = state

		const roomCode = rooms.get(roomInfo)

		if (roomCode == undefined) return state

		const findMessageByID =
			roomCode['messages'].length == 0
				? undefined
				: (roomCode['messages']?.findIndex((msgInfo) => {
						if (message.own_message == true) return msgInfo.message_id === client_id
						return msgInfo.message_id === message.message_id
					}) ?? undefined)

		if (findMessageByID == undefined || findMessageByID < 0) return state

		return {
			...state,
			rooms: new Map(rooms).set(roomInfo, {
				roomInfo: roomCode['roomInfo'],
				messages: [
					...roomCode['messages'].slice(0, findMessageByID),
					{
						...roomCode['messages'][findMessageByID],
						...CREATE_MESSAGE_OBJ_WITH_FALLBACK(message),
						...(message.messageStatus != null && { messageStatus: message.messageStatus })
					},
					...roomCode['messages'].slice(findMessageByID + 1, roomCode['messages'].length)
				]
			})
		}
	},
	[STATE_ACTIONS.ADD_MESSAGE]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'ADD_MESSAGE'>
	}) {
		const {
			roomInfo,
			newMessage: { message, sender }
		} = payload
		const { rooms, users } = state

		const roomCode = rooms.get(roomInfo)

		if (roomCode == undefined) return state

		return {
			rooms: new Map(rooms).set(roomInfo, {
				roomInfo: roomCode['roomInfo'],
				messages: [...roomCode['messages'], { ...CREATE_MESSAGE_OBJ_WITH_FALLBACK(message), messageStatus: 'sended' }]
			}),
			users: ADD_USERS_MAP(sender, users)
		}
	},

	[STATE_ACTIONS.LEAVE_ROOM]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'LEAVE_ROOM'>
	}) {
		const { room_id } = payload
		const { rooms } = state

		const roomCode = rooms.get(room_id)
		if (roomCode == undefined) return state

		try {
			const mappedRooms = new Map(rooms)
			if (mappedRooms.delete(room_id)) return { ...state, rooms: mappedRooms }
			return state
		} catch {
			return state
		}
	},

	[STATE_ACTIONS.DELETED_MESSAGE]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'DELETED_MESSAGE'>
	}) {
		const { roomInfo, message } = payload
		const { rooms } = state

		const roomCode = rooms.get(roomInfo['room_id'])

		if (roomCode == undefined) return state

		return {
			...state,
			rooms: new Map(rooms).set(roomInfo['room_id'], {
				roomInfo: roomCode['roomInfo'],
				messages: roomCode['messages'].filter((msg) => msg.message_id != message.message_id)
			})
		}
	}
}

export function roomReducer(state: typeof initialReducerState, action: PAYLOAD_TYPES) {
	const { type, payload } = action
	const grabActionFunc = roomStateActions[type]

	if (grabActionFunc == undefined) return state
	return grabActionFunc({ state, payload: payload as keyof Parameters<typeof grabActionFunc>[0]['payload'] })
}
