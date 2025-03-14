import { Messages } from '@/app/_utils/tableTypes'
import { WS_ENDPOINTS_EVENTS } from '@chat-app/utils/globalConstants'

type KEYS_ENDPOINTS = {
	[key in keyof typeof WS_ENDPOINTS_EVENTS]: object
}

export interface WS_ENDPOINTS_TYPES extends KEYS_ENDPOINTS {
	sendMessage: {
		new_message: {
			message_content: Messages['message_content']
			file_id: Messages['file_id']
			message_id: Messages['message_id']
			date_sended: Messages['date_sended']
		}
		roomID: string
		own_message: boolean
		client_id: string
	}
}
