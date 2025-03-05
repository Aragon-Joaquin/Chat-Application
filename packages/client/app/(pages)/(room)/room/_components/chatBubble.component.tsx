import { roomState } from '../_reducers/types'
import { Heading, Text } from '@radix-ui/themes'
import { useRoomContext } from '../_hooks/consumeRoomContext'
import ImageAndFallback from './ImageAndFallback.component'

export function ChatBubble({ roomAllProps }: { roomAllProps: roomState }) {
	const {
		selectedRoom: { setSelectedRoom }
	} = useRoomContext()
	const { roomInfo, messages } = roomAllProps

	return (
		<li
			className="flex flex-row items-center gap-x-2 p-2 rounded-md hover:bg-transparent/10 hover:cursor-pointer odd:bg-neutral-100/80"
			onClick={() => setSelectedRoom(roomInfo.room_id)}
		>
			<aside className="w-12 h-12">
				<ImageAndFallback roomInfo={roomInfo} />
			</aside>

			<div>
				<Heading as="h4" size="4" weight="bold">
					{roomInfo.room_name}
				</Heading>
				<span>
					<Text as="p">{messages.at(-1)?.userName ?? 'No messages yet.'}</Text>
				</span>
			</div>
		</li>
	)
}
