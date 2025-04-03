import {
	initialReducerState,
	PAYLOAD_TYPES,
	PICK_PAYLOAD,
	roomState,
	STATE_ACTIONS,
	UUID_CLIENT_GENERATED
} from './types'
import { ADD_USERS_MAP, CREATE_MESSAGE_OBJ_WITH_FALLBACK } from './utils'

const roomStateActions = {
	[STATE_ACTIONS.ADD_USERS]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'ADD_USERS'>
	}) {
		const { users } = state

		const newMap = new Map(users)
		if (!Array.isArray(payload)) {
			const getUser = users.get(payload.user_id)
			if (getUser != undefined) return state

			return {
				...state,
				users: newMap.set(payload.user_id, payload)
			}
		}

		payload.forEach((userElement) => {
			const getUser = users.get(userElement.user_id)
			if (getUser != undefined) return state
			newMap.set(userElement.user_id, userElement)
		})

		return {
			...state,
			users: newMap
		}
	},

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
			users: new Map(users).set(userID, {
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
		const { roomInfo, userInfo } = payload
		if (!payload || !roomInfo.length) return state

		const { rooms, users } = state
		const filteredRoom: Map<string, roomState> = new Map()

		roomInfo.forEach(({ messages, roomInfo }) => {
			const getRoom = rooms?.get(roomInfo['room_id'])
			if (getRoom != undefined) return
			filteredRoom.set(roomInfo['room_id'], { roomInfo, messages })
		})

		return {
			rooms: new Map([...rooms, ...filteredRoom]),
			users: ADD_USERS_MAP(
				userInfo?.map((user) => user),
				users
			)
		}
	},

	[STATE_ACTIONS.MODIFY_ROOM]: function ({
		state,
		payload
	}: {
		state: typeof initialReducerState
		payload: PICK_PAYLOAD<'MODIFY_ROOM'>
	}) {
		const { roomID, newProps } = payload
		const { rooms } = state

		const roomFound = rooms.get(roomID)
		if (roomFound == undefined) return state

		return {
			...state,
			rooms: new Map(rooms).set(roomID, {
				...roomFound,
				roomInfo: {
					...roomFound.roomInfo,
					...newProps
				}
			})
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
							which_room: roomInfo
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
						if (msgInfo.message_id?.includes(UUID_CLIENT_GENERATED)) return msgInfo.message_id === client_id
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
		const { roomInfo, newMessage, order = 'asNewest' } = payload
		const { rooms } = state

		const roomCode = rooms.get(roomInfo)

		const fallbackMessages = Array.isArray(newMessage)
			? newMessage.map((message) => CREATE_MESSAGE_OBJ_WITH_FALLBACK(message))
			: { ...CREATE_MESSAGE_OBJ_WITH_FALLBACK(newMessage), messageStatus: 'sended' }

		if (roomCode == undefined) return state

		if (order === 'asNewest') {
			return {
				...state,
				rooms: new Map(rooms).set(roomInfo, {
					roomInfo: roomCode['roomInfo'],
					...(Array.isArray(fallbackMessages)
						? { messages: [...roomCode['messages'], ...fallbackMessages] }
						: { messages: [...roomCode['messages'], fallbackMessages] })
				})
			}
		}

		return {
			...state,
			rooms: new Map(rooms).set(roomInfo, {
				roomInfo: roomCode['roomInfo'],
				...(Array.isArray(fallbackMessages)
					? { messages: [...fallbackMessages, ...roomCode['messages']] }
					: { messages: [fallbackMessages, ...roomCode['messages']] })
			})
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
