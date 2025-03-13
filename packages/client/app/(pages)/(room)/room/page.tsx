'use client'

import { NoChatSelected } from './_components/NoChatSelected.component'
import { useRoomContext } from './_hooks/consumeRoomContext'
import { FooterRoom, HeaderRoom, MessagesRoom } from './_components/RoomLayout'

export default function RoomPage() {
	const {
		selectedRoom: { selectedKeyRoom },
		RoomCtx: { roomState }
	} = useRoomContext()

	//const mainRef = useRef<HTMLElement>(null)
	//mainRef?.current?.scrollTo({ behavior: 'instant', left: 0, top: mainRef?.current.offsetHeight })

	if (selectedKeyRoom == undefined) return <NoChatSelected />

	const actualRoom = roomState.get(selectedKeyRoom!)!

	return (
		<main className="relative flex flex-col w-full h-full">
			<HeaderRoom room={actualRoom['roomInfo']} />
			<main className="h-full mb-16 overflow-y-auto bg-chatBackground bg-blend-lighten bg-white/90 bg-no-repeat bg-cover bg-center [scrollbar-width:thin]">
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
