import { BadRequestType } from '@/app/_errors'
import { Messages, RoomInfo, UserInfo } from '@/app/_utils/tableTypes'
export interface WS_ENDPOINTS_TYPES {
	sendMessage: {
		new_message: {
			message_content: Messages['message_content']
			file_base64: Messages['file_base64']
			message_id: Messages['message_id']
		}
		date_sended: Messages['date_sended']
		from_user_id: UserInfo['user_id']
		roomID: string
		client_id?: string
	}

	//! error_content is just additional non-UI information to handle in client
	errorChannel: { error_name: string; error_code: BadRequestType; error_content?: Record<string, unknown> }

	createdRoom: {
		room_id: string
		room_name: string
		room_description: string | null
		created_at: Date
		room_picture: string | null
	}

	joinedRoom:
		| {
				room_id: RoomInfo['room_id']
				userInfo: {
					user_id: UserInfo['user_id']
					user_name: UserInfo['user_name']
					profile_picture: UserInfo['profile_picture']
				}
		  }
		| {
				room_id: RoomInfo['room_id']
				room_name: RoomInfo['room_name']
				room_description: RoomInfo['room_description']
				created_at: RoomInfo['created_at']
				room_picture: RoomInfo['room_picture']
		  }
	sendMediaFiles:
		| {
				type: 'chatIMG'
				clientID: UserInfo['user_id']
				roomID: RoomInfo['room_id']
				fileSrc: Base64URLString
				date_sended: Date
		  }
		| {
				type: 'roomPicture'
				roomID: RoomInfo['room_id']
				fileSrc: string
		  }
		| {
				type: 'userPicture'
				clientID: UserInfo['user_id']
				fileSrc: string
		  }

	leavedRoom: {
		user_name: string
		room_id: RoomInfo['room_id']
	}
}
