'use client'

import { NoChatSelected } from './_components/NoChatSelected.component'
import { useRoomContext } from './_hooks/consumeRoomContext'
import { FooterRoom, HeaderRoom } from './_components/RoomLayout'

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
			<div className="flex-1">main content here</div>
			<FooterRoom />
		</main>
	)
}
