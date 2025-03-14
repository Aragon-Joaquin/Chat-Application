'use client'

import { NoChatSelected } from './_components/NoChatSelected.component'
import { useRoomContext } from './_hooks/consumeRoomContext'
import { FooterRoom, HeaderRoom, MessagesRoom } from './_components/RoomLayout'
import { useRef } from 'react'

export default function RoomPage() {
	const {
		selectedRoom: { selectedKeyRoom },
		RoomCtx: { roomState }
	} = useRoomContext()

	const mainRef = useRef<HTMLElement>(null)

	if (selectedKeyRoom == undefined) return <NoChatSelected />

	const actualRoom = roomState.get(selectedKeyRoom)!
	console.log(actualRoom)

	// i have no idea how to make it to scroll down
	setTimeout(() => mainRef?.current?.scrollTo({ behavior: 'instant', left: 0, top: mainRef?.current.scrollHeight }), 0)

	return (
		<main className="relative flex flex-col w-full h-full">
			<HeaderRoom room={actualRoom['roomInfo']} />
			<main
				className="h-full mb-16 overflow-y-auto bg-chatBackground bg-blend-lighten bg-white/90 bg-no-repeat bg-cover bg-center [scrollbar-width:thin]"
				ref={mainRef}
			>
				<div className="opacity-100 p-4 w-full h-full">
					{actualRoom?.messages.map((messageType) => {
						return <MessagesRoom key={messageType.message_id} messages={messageType} />
					})}
				</div>
			</main>
			<FooterRoom />
		</main>
	)
}
