export const STATE_ACTIONS = {
	ADD_ROOM: 'ADD_ROOMS',
	LEAVE_ROOM: 'LEAVE_ROOM',
	ADD_MESSAGE: 'ADD_MESSAGE',
	DELETED_MESSAGE: 'DELETED_MESSAGE'
}

type Messages = {
	userName: string
	messageID: string
	URLFile?: string
}

export type roomState = {
	roomKey: string
	messages: Messages[]
}

export type reducerActions = {
	payload: roomState | roomState['roomKey']
	type: keyof typeof STATE_ACTIONS
}

type TYPES_NAMES<T extends keyof typeof STATE_ACTIONS> = Extract<keyof typeof STATE_ACTIONS, T>

export type PAYLOAD_TYPES =
	| { type: TYPES_NAMES<'ADD_ROOM'>; payload: roomState['roomKey'] }
	| { type: TYPES_NAMES<'ADD_MESSAGE'>; payload: { roomInfo: roomState['roomKey']; newMessage: roomState['messages'] } }
	| { type: TYPES_NAMES<'LEAVE_ROOM'>; payload: roomState['roomKey'] }
	| {
			type: TYPES_NAMES<'DELETED_MESSAGE'>
			//! i'll omit 'userName' if i need it in a future
			payload: { roomInfo: roomState['roomKey']; message: Omit<Messages, 'URLFile' | 'userName'> }
	  }

export type PICK_PAYLOAD<T extends keyof typeof STATE_ACTIONS> = Extract<PAYLOAD_TYPES, { type: T }>['payload']
