'use client'

import { NoChatSelected } from './_components/NoChatSelected.component'
import { useRoomContext } from './_hooks/consumeRoomContext'
import { FooterRoom, HeaderRoom, MessagesRoom } from './_components/RoomLayout'

/*
! im thinking instead of using a dynamic segment, i preffer making a state pointing to which roomid render
! if its too render-expensive, then i'll make a context only for this function cuz if i use the global room context
! it would probably render the layout as well.
*/

export default function RoomPage() {
	const {
		selectedRoom: { selectedRoom }
	} = useRoomContext()

	if (selectedRoom == undefined) return <NoChatSelected />

	return (
		<main className="flex flex-col w-full h-full">
			<HeaderRoom room={selectedRoom['roomInfo']} />
			<main className="flex-1 bg-chatBackground bg-blend-lighten bg-white/90 bg-no-repeat bg-cover">
				<div className="opacity-100 p-4 w-full overflow-y-auto">
					{selectedRoom?.messages.map((messageType) => {
						return <MessagesRoom key={messageType.message_id} messages={messageType} />
					})}
				</div>
			</main>
			<FooterRoom />
		</main>
	)
}
