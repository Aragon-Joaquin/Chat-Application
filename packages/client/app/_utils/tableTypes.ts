export type Messages = {
	message_id: `${string}-${string}-${string}-${string}-${string}` | string
	which_room: string
	date_sended: Date | string
	message_content: string | null
	file_id: string | null

	//could use sender_info: {user_name: string} | {own_message: boolean} but it requires me to modify all references of the state
	sender_id?: UserInfo['user_id']
	own_message?: boolean
}

export type RoomInfo = {
	room_id: string
	room_name: string
	created_at: Date
	room_description: string | null
	room_picture: string | null
}

export type UserInfo = {
	user_name: string
	user_id: number
	profile_picture: string | ''
}
