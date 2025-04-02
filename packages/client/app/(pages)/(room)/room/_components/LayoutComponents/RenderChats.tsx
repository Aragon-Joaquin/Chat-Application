import { memo } from 'react'
import { NoChatsAvailable } from '../noChatsAvailable.component'
import { ChatBubble } from '../chatBubble.component'
import { useRoomContext } from '../../_hooks/consumeRoomContext'

export const LayoutRenderChat = memo(function RenderChatBubble() {
	const {
		RoomCtx: { roomState }
	} = useRoomContext()

	return (
		<main className="overflow-y-auto">
			{roomState.size == 0 ? (
				<NoChatsAvailable />
			) : (
				<ul className="flex flex-col gap-y-2">
					{[...roomState.entries()].map(([key, value]) => {
						return <ChatBubble key={key} roomAllProps={value} />
					})}
				</ul>
			)}
		</main>
	)
})
