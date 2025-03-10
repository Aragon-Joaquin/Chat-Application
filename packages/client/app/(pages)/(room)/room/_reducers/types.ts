import { Messages, RoomInfo } from '@/app/_utils/tableTypes'

export const STATE_ACTIONS = {
	ADD_ROOM: 'ADD_ROOM',
	ADD_MULTIPLE_ROOMS: 'ADD_MULTIPLE_ROOMS',
	LEAVE_ROOM: 'LEAVE_ROOM',
	ADD_MESSAGE: 'ADD_MESSAGE',
	DELETED_MESSAGE: 'DELETED_MESSAGE'
}

export type roomState = {
	roomInfo: RoomInfo
	messages: Messages[]
}

type TYPES_NAMES<T extends keyof typeof STATE_ACTIONS> = Extract<keyof typeof STATE_ACTIONS, T>

export type PAYLOAD_TYPES =
	| { type: TYPES_NAMES<'ADD_ROOM'>; payload: roomState['roomInfo'] }
	| { type: TYPES_NAMES<'ADD_MULTIPLE_ROOMS'>; payload: Array<roomState> }
	| {
			type: TYPES_NAMES<'ADD_MESSAGE'>
			payload: { roomInfo: roomState['roomInfo']; newMessage: roomState['messages'] }
	  }
	| { type: TYPES_NAMES<'LEAVE_ROOM'>; payload: roomState['roomInfo'] }
	| {
			type: TYPES_NAMES<'DELETED_MESSAGE'>
			//! i'll omit 'userName' if i need it in a future
			payload: { roomInfo: roomState['roomInfo']; message: Omit<Messages, 'URLFile' | 'userName'> }
	  }

export type PICK_TYPE<T extends keyof typeof STATE_ACTIONS> = Extract<PAYLOAD_TYPES, { type: T }>
export type PICK_PAYLOAD<T extends keyof typeof STATE_ACTIONS> = PICK_TYPE<T>['payload']
