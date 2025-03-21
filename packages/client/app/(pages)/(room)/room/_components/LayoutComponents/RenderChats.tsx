import { memo } from 'react'
import { NoChatsAvailable } from '../noChatsAvailable.component'
import { ChatBubble } from '../chatBubble.component'
import { roomState } from '../../_reducers/types'

export const LayoutRenderChat = memo(function RenderChatBubble({ roomState }: { roomState: Map<string, roomState> }) {
	return (
		<main className="flex-1 borderLayout overflow-y-auto !border-b-0">
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
