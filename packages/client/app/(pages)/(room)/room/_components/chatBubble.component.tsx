import Image from 'next/image'
import { roomState } from '../_reducers/types'
import { Heading, Text } from '@radix-ui/themes'

export function ChatBubble({ roomAllProps }: { roomAllProps: roomState }) {
	const { roomInfo, messages } = roomAllProps

	return (
		<li className="flex flex-row items-center gap-x-2 p-2 rounded-md hover:bg-transparent/10 hover:cursor-pointer odd:bg-neutral-100/80">
			<aside className="w-12 h-12">
				{roomInfo?.room_picture != null ? (
					<Image
						src={roomInfo.room_picture}
						alt={`${roomInfo.room_name}`}
						className={`${roomInfo.room_description}`}
						title="Group Image"
					/>
				) : (
					<div className="w-full h-full bg-neutral-300 rounded-full border-2 border-neutral-400" />
				)}
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
