import { Heading, Text } from '@radix-ui/themes'
import { ImageAndFallback } from '@app/_components/ImageAndFallback.component'
import { transformToDate } from '@/app/_utils/utils'
import { Messages } from '@/app/_utils/tableTypes'
import { messageStatus } from '../../_reducers/types'
import { ClockIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { memo } from 'react'
import { useRoomContext } from '../../_hooks/consumeRoomContext'
import { ServerMessage } from './messageTypes/ServerMessage'

function MessagesRoomNoMemo({ messages }: { messages: Messages & messageStatus }) {
	const {
		RoomCtx: { userState },
		currentUser: { currentUser }
	} = useRoomContext()

	// message_id, which_room
	const { message_content, sender_id, date_sended, messageStatus, type, file_base64 } = messages

	//! atomize this & improve it
	if (type === 'server') return <ServerMessage message_content={message_content} />

	const actualUser = userState?.get(sender_id ?? 0)
	const ownMessage = actualUser?.user_id === currentUser
	return (
		<span
			className={`flex flex-row gap-x-4 ${ownMessage && '!flex-row-reverse'} ${messageStatus === 'error' && 'bg-red-600/60 p-2 rounded-md'}`}
		>
			<ImageAndFallback
				picture={actualUser?.profile_picture ?? ''}
				altName={actualUser?.user_name ?? ''}
				description={`Image of ${actualUser?.user_name ?? ''}`}
				size={60}
			/>

			<span
				className={`flex flex-col bg-neutral-200 p-2 rounded-md relative mt-3 m-1 max-w-[50%]
			before:content-[''] before:absolute before:w-0 before:h-0 before:border-8 before:border-transparent before:border-t-neutral-200 before:top-0
			${ownMessage ? 'rounded-tr-none before:right-0 before:translate-x-full before:border-l-neutral-200' : 'rounded-tl-none before:left-0 before:-translate-x-full before:border-r-neutral-200'}`}
			>
				<Heading
					as="h5"
					size="3"
					className={`text-blue-800 overflow-clip text-nowrap text-ellipsis max-w-fit ${ownMessage && '!text-red-800 place-self-end'}`}
					title={actualUser?.user_name ?? ''}
				>
					{ownMessage ? 'You' : (actualUser?.user_name ?? '')}
				</Heading>
				{file_base64 != null ? (
					<ImageAndFallback
						picture={file_base64}
						altName={`Image of ${actualUser?.user_name}`}
						size={130}
						className="!aspect-video"
						renderAsBase64
					/>
				) : (
					<Text as="p" className={`text-black font-sans text-pretty`}>{String.raw`${message_content ?? ''}`}</Text>
				)}
				<Text as="label" size="1" color="gray" className={`mt-1 flex justify-end ${ownMessage && '!justify-start'}`}>
					{transformToDate(date_sended)}
				</Text>
				{messageStatus != undefined && (
					<div
						className={`${messageStatus === 'sended' && 'hidden'} absolute bottom-0 right-2 !-translate-y-1/2 hover:cursor-pointer`}
						color={`${messageStatus === 'error' ? 'tomato' : 'indigo'}`}
						title={`${messageStatus === 'error' ? "Message couldn't be send." : 'Loading...'}`}
					>
						{messageStatus === 'loading' && <ClockIcon color="blue" />}
						{messageStatus === 'error' && <ExclamationTriangleIcon color="red" />}
					</div>
				)}
			</span>
		</span>
	)
}

export const MessagesRoom = memo(MessagesRoomNoMemo)
