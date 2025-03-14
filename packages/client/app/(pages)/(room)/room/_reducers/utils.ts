import { Messages } from '@/app/_utils/tableTypes'

/**
 * @description This function creates the Messages object even though some props from the parameter are missing
 * @param message Pass the props that the message might containt.
 * @returns Messages object. If a key/value is missing, it will change the field to an empty string, null or false
 */
export const CREATE_MESSAGE_OBJ_WITH_FALLBACK = (message: Partial<Messages>): Messages => {
	return {
		message_content: message.message_content ?? '',
		date_sended: message.date_sended ?? '',
		file_id: message.file_id ?? null,
		message_id: message.message_id ?? '',
		own_message: message.own_message ?? false,
		profile_picture: message.profile_picture ?? '',
		user_name: message.user_name ?? '',
		which_room: message.which_room ?? ''
	}
}
