import { Messages, UserInfo } from '@/app/_utils/tableTypes'

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
		sender_id: message.sender_id ?? 0,
		which_room: message.which_room ?? ''
	}
}

export const ADD_USERS_MAP = (newUser: UserInfo[] | UserInfo, state: Map<number, UserInfo>) => {
	if (newUser == undefined) return state

	if (!Array.isArray(newUser)) {
		const founded = state.get(newUser['user_id'])

		if (founded != undefined) return state
		return new Map(state).set(newUser['user_id'], newUser)
	}

	if (!newUser?.length) return state

	const newMap = new Map<UserInfo['user_id'], UserInfo>(state)

	newUser.forEach((user) => {
		const founded = state.get(user['user_id'])
		if (founded != undefined) return
		newMap.set(user['user_id'], user)
	})

	return newMap
}
