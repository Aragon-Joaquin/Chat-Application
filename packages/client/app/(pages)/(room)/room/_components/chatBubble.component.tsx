import { roomState } from '../_reducers/types'
import { Heading, Strong, Text } from '@radix-ui/themes'
import { useRoomContext } from '../_hooks/consumeRoomContext'
import { ImageAndFallback } from '@app/_components/ImageAndFallback.component'
import { transformToDate } from '@/app/_utils/utils'
import { memo } from 'react'

function ChatBubbleNoMemoized({ roomAllProps }: { roomAllProps: roomState }) {
	const {
		selectedRoom: { selectedKeyRoom, setSelectedKeyRoom },
		RoomCtx: { userState }
	} = useRoomContext()

	const { roomInfo, messages } = roomAllProps

	return (
		<li
			className={`flex flex-row items-center h-16 gap-x-2 p-1 rounded-md hover:bg-transparent/10 hover:cursor-pointer odd:bg-neutral-100/80 transition-all
				${selectedKeyRoom === roomInfo.room_id && '!bg-blue-400/40'}`}
			onClick={() => setSelectedKeyRoom(roomInfo.room_id)}
		>
			<aside className="h-16 w-16 min-w-16 min-h-16 p-1">
				<ImageAndFallback picture={roomInfo.room_picture ?? ''} />
			</aside>

			<div className="w-full">
				<span className="w-full max-h-fit flex flex-row gap-x-1 justify-between items-center">
					<Heading
						as="h4"
						size="4"
						weight="bold"
						className="w-[50%] h-fit text-nowrap text-ellipsis overflow-hidden"
						title={roomInfo.room_name}
					>
						{roomInfo.room_name}
					</Heading>

					<Text size="1" weight="regular" wrap="nowrap" color="gray" className="!text-center pr-1 lg:!text-sm">
						{transformToDate(messages?.at(-1)?.date_sended)}
					</Text>
				</span>

				<span>
					<Text as="span" className="flex flex-row gap-x-1 max-w-[260px]">
						{messages?.at(-1) != undefined ? (
							<>
								<Strong
									truncate
									className="max-w-[50%]"
								>{`${messages.at(-1)?.own_message ? 'You' : (userState.get(messages.at(-1)?.sender_id ?? 0)?.user_name ?? '???')}:`}</Strong>
								<p className="w-fit truncate">{messages.at(-1)?.message_content}</p>
							</>
						) : (
							'No messages yet.'
						)}
					</Text>
				</span>
			</div>
		</li>
	)
}

export const ChatBubble = memo(ChatBubbleNoMemoized)
