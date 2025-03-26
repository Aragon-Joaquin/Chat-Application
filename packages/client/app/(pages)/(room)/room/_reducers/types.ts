import { Messages, RoomInfo, UserInfo } from '@/app/_utils/tableTypes'
import { CLIENT_UUID_TYPE } from '@/app/_utils/utils'

// this is a ID just to identify it in the client, when it goes through the server the id will change
export const UUID_CLIENT_GENERATED = '_client-side' as const

export const STATE_ACTIONS = {
	ADD_ROOM: 'ADD_ROOM',
	ADD_MULTIPLE_ROOMS: 'ADD_MULTIPLE_ROOMS',
	LEAVE_ROOM: 'LEAVE_ROOM',
	ADD_MESSAGE: 'ADD_MESSAGE',
	ADD_OWN_MESSAGE: 'ADD_OWN_MESSAGE',
	MODIFY_MESSAGE: 'MODIFY_MESSAGE',
	DELETED_MESSAGE: 'DELETED_MESSAGE',
	MODIFY_USERINFO: 'MODIFY_USERINFO'
}

export type messageStatus = { messageStatus?: 'sended' | 'loading' | 'error' }

export type roomState = {
	roomInfo: RoomInfo
	//! messageStatus its for client-side
	messages: (Messages & messageStatus)[]
}

export type reducerState = {
	roomState: roomState
	userInfo: UserInfo
}

export const initialReducerState = {
	rooms: new Map<RoomInfo['room_id'], roomState>(),
	users: new Map<UserInfo['user_id'], UserInfo>()
}

type TYPES_NAMES<T extends keyof typeof STATE_ACTIONS> = Extract<keyof typeof STATE_ACTIONS, T>

export type PAYLOAD_TYPES =
	| { type: TYPES_NAMES<'ADD_ROOM'>; payload: roomState['roomInfo'] }
	| { type: TYPES_NAMES<'ADD_MULTIPLE_ROOMS'>; payload: { roomInfo: roomState[]; userInfo: UserInfo[] } }
	| {
			type: TYPES_NAMES<'ADD_MESSAGE'>
			payload: {
				roomInfo: roomState['roomInfo']['room_id']
				newMessage: { message: Partial<Messages>; sender: UserInfo }
			}
	  }
	| {
			type: TYPES_NAMES<'ADD_OWN_MESSAGE'>
			payload: {
				roomInfo: roomState['roomInfo']['room_id']
				ownMessage: Pick<Messages, 'message_content'> //& messageStatus
				client_id: CLIENT_UUID_TYPE
			}
	  }
	| {
			type: TYPES_NAMES<'MODIFY_MESSAGE'>
			payload: {
				roomInfo: roomState['roomInfo']['room_id']
				message: Partial<Messages> & messageStatus
				client_id?: CLIENT_UUID_TYPE | string
			}
	  }
	| { type: TYPES_NAMES<'LEAVE_ROOM'>; payload: { room_id: roomState['roomInfo']['room_id'] } }
	| {
			type: TYPES_NAMES<'DELETED_MESSAGE'>
			//! i'll omit 'userName' if i need it in a future
			payload: { roomInfo: roomState['roomInfo']; message: Messages }
	  }
	| {
			type: TYPES_NAMES<'MODIFY_USERINFO'>
			payload: { userID: UserInfo['user_id']; newProps: Omit<UserInfo, ' user_id'> }
	  }

export type PICK_TYPE<T extends keyof typeof STATE_ACTIONS> = Extract<PAYLOAD_TYPES, { type: T }>
export type PICK_PAYLOAD<T extends keyof typeof STATE_ACTIONS> = PICK_TYPE<T>['payload']
