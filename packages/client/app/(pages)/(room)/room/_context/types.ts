import { BadRequestType } from '@/app/_errors'
import { Messages, UserInfo } from '@/app/_utils/tableTypes'
export interface WS_ENDPOINTS_TYPES {
	sendMessage: {
		new_message: {
			message_content: Messages['message_content']
			file_id: Messages['file_id']
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
}
