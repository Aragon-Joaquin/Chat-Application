'use client'

import { NoChatSelected } from './_components/NoChatSelected.component'
import { useRoomContext } from './_hooks/consumeRoomContext'
import { FooterRoom, HeaderRoom, MessagesRoom } from './_components/RoomLayout'
import { memo, useRef } from 'react'
import { roomState } from './_reducers/types'

export default function RoomPage() {
	const {
		selectedRoom: { selectedKeyRoom },
		RoomCtx: { roomState }
	} = useRoomContext()

	const mainRef = useRef<HTMLElement>(null)

	const actualRoom = roomState.get(selectedKeyRoom ?? '')
	if (actualRoom == undefined) return <NoChatSelected />

	// i have no idea how to make it to scroll down other than this
	setTimeout(() => mainRef?.current?.scrollTo({ behavior: 'instant', left: 0, top: mainRef?.current.scrollHeight }), 0)

	const { room_name, room_description, room_id, room_picture } = actualRoom['roomInfo']

	return (
		<main className="relative flex flex-col w-full h-full">
			<HeaderRoom
				room_name={room_name}
				room_id={room_id}
				room_description={room_description}
				room_picture={room_picture}
			/>

			<main
				className="h-full mb-16 overflow-y-auto bg-chatBackground bg-blend-lighten bg-white/90 bg-no-repeat bg-cover bg-center [scrollbar-width:thin]"
				ref={mainRef}
			>
				<>
					<RenderMessages messages={actualRoom.messages} />
				</>
			</main>
			<FooterRoom />
		</main>
	)
}

const RenderMessages = memo(function RenderMessagesNoMemoized({ messages }: { messages: roomState['messages'] }) {
	return (
		<div className="opacity-100 p-4 w-full h-full">
			{messages.map((messageType) => {
				return <MessagesRoom key={messageType.message_id} messages={messageType} />
			})}
		</div>
	)
})
