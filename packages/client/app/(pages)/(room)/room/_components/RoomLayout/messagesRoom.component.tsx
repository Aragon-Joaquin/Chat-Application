import { Heading, Text } from '@radix-ui/themes'
import { ImageAndFallback } from '@app/_components/ImageAndFallback.component'
import { transformToDate } from '@/app/_utils/utils'
import { Messages } from '@/app/_utils/tableTypes'
import { messageStatus } from '../../_reducers/types'
import { ClockIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { memo } from 'react'

function MessagesRoomNoMemo({ messages }: { messages: Messages & messageStatus }) {
	const {
		profile_picture,
		user_name,
		message_content,
		own_message,
		file_id,
		message_id,
		which_room,
		date_sended,
		messageStatus
	} = messages

	return (
		<span
			className={`flex flex-row gap-x-4 ${own_message && '!flex-row-reverse'} ${messageStatus === 'error' && 'bg-red-600/60 p-2 rounded-md'}`}
		>
			<div className="min-h-12 min-w-12 w-12 h-12">
				<ImageAndFallback picture={profile_picture ?? ''} altName={user_name} description={`Image of ${user_name}`} />
			</div>

			<span
				className={`flex flex-col bg-neutral-200 p-2 rounded-md relative mt-3 m-1 max-w-[50%]
			before:content-[''] before:absolute before:w-0 before:h-0 before:border-8 before:border-transparent before:border-t-neutral-200 before:top-0
			${own_message ? 'rounded-tr-none before:right-0 before:translate-x-full before:border-l-neutral-200' : 'rounded-tl-none before:left-0 before:-translate-x-full before:border-r-neutral-200'}`}
			>
				<Heading
					as="h5"
					size="3"
					className={`text-blue-800 overflow-clip text-nowrap text-ellipsis max-w-fit ${own_message && '!text-red-800 place-self-end'}`}
					title={user_name}
				>
					{own_message ? 'You' : user_name}
				</Heading>
				<Text as="p" className={`text-black font-sans text-pretty`}>{String.raw`${message_content ?? ''}`}</Text>
				<Text as="label" size="1" color="gray" className={`mt-1 flex justify-end ${own_message && '!justify-start'}`}>
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
