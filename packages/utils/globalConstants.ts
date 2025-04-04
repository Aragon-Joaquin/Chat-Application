export const WS_PORT = 8080 as const
export const WS_NAMESPACE = 'roomChats'

export const WS_ACTIONS = {
	LEAVE: 'leaveRoom',
	JOIN: 'joinRoom',
	JOIN_MULTIPLE: 'joinRooms',
	SEND: 'sendMessage',
	DELETE: 'deleteMessage',
	CREATE: 'createRoom',
	SEND_MEDIA: 'sendMediaFiles'
} as const

export const WS_ENDPOINTS_EVENTS = {
	MESSAGE: 'sendMessage',
	JOINED_ROOM: 'joinedRoom',
	LEAVED_ROOM: 'leavedRoom',
	DELETE_MESSAGE: 'deleteMessage',
	CREATE_ROOM: 'createdRoom',
	ERROR_CHANNEL: 'errorChannel',
	MEDIA_CHANNEL: 'mediaChannel'
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

export const PUBLIC_FOLDER_NAME = '/assets/' as const
export const MAX_MESSAGES_PER_REQ = 30 as const
