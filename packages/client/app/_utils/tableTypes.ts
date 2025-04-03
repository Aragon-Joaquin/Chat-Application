export type Messages = {
	type: 'user' | 'server' | 'admin'
	message_id: `${string}-${string}-${string}-${string}-${string}` | string
	which_room: string
	date_sended: Date | string
	message_content: string | null
	file_base64: Base64URLString | null
	sender_id: UserInfo['user_id']
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
