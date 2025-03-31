import { RoomInfo, UserInfo } from '@/app/_utils/tableTypes'
import { CLIENT_UUID_TYPE } from '@/app/_utils/utils'
import { WS_ACTIONS } from '@chat-app/utils/globalConstants'

type SelectWSAction<T extends keyof typeof WS_ACTIONS> = (typeof WS_ACTIONS)[T]
export type wsPayloads =
	| { action: SelectWSAction<'JOIN'>; payload: { roomID: RoomInfo['room_id']; roomPassword: string | '' } }
	| { action: SelectWSAction<'CREATE'>; payload: { roomName: RoomInfo['room_name']; roomPassword?: string } }
	| { action: SelectWSAction<'LEAVE'>; payload: { roomID: RoomInfo['room_id'] } }
	| { action: SelectWSAction<'DELETE'>; payload: { messageID: string; roomID: RoomInfo['room_id'] } }
	| {
			action: SelectWSAction<'SEND'>
			payload: {
				messageString: string
				roomID: string
				file?: string
				client_id: CLIENT_UUID_TYPE
			}
	  }
	| {
			action: SelectWSAction<'SEND_MEDIA'>
			payload: {
				type: MEDIA_PAYLOADS
				file: string | ArrayBuffer
			}
	  }

export type PICK_WS_PAYLOAD<T extends keyof typeof WS_ACTIONS> = Extract<
	wsPayloads,
	{ action: (typeof WS_ACTIONS)[T] }
>['payload']

//! extras for the wsPayload
type MEDIA_PAYLOADS =
	| {
			action: 'roomPicture'
			roomPicture: {
				roomID: RoomInfo['room_id']
			}
	  }
	| {
			action: 'userPicture'
			userPicture: {
				userID: UserInfo['user_id']
			}
	  }
	| {
			action: 'chatIMG'
			chatIMG: {
				roomID: RoomInfo['room_id']
				userID: UserInfo['user_id']
			}
	  }
