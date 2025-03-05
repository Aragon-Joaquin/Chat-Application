'use client'

import { NoChatSelected } from './_components/NoChatSelected.component'

/*
! im thinking instead of using a dynamic segment, i preffer making a state pointing to which roomid render
! if its too render-expensive, then i'll make a context only for this function cuz if i use the global room context
! it would probably render the layout as well.
*/

export default function RoomPage() {
	return <NoChatSelected />
}
