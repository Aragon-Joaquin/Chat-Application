export type Messages = {
	message_id: `${string}-${string}-${string}-${string}-${string}`
	which_room: string
	date_sended: Date
	message_content: string | null
	file_id: string | null

	//user sender props
	user_name: string
	own_message: boolean
	profile_picture: string | null
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
