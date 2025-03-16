export const WS_PORT = 8080 as const
export const WS_NAMESPACE = 'roomChats'

export const WS_ACTIONS = {
	LEAVE: 'leaveRoom',
	JOIN: 'joinRoom',
	JOIN_MULTIPLE: 'joinRooms',
	SEND: 'sendMessage',
	DELETE: 'deleteMessage',
	CREATE: 'createRoom'
} as const

export const WS_ENDPOINTS_EVENTS = {
	MESSAGE: 'sendMessage',
	JOINED_ROOM: 'joinedRoom',
	LEAVED_ROOM: 'leavedRoom',
	DELETE_MESSAGE: 'deleteMessage',
	ERROR_CHANNEL: 'errorChannel'
} as const

export const ROLES = {
	user: 'user',
	admin: 'admin',
	owner: 'owner'
} as const

export const MAXIMUM_ROOMS_PER_USER = 5 as const

export const COOKIE_EXPIRATION = {
	ANNOTATION_MODE: '12h',
	BY_SECONDS: 43200
} as const
