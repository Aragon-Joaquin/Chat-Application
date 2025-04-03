'use client'

import { NoChatSelected } from './_components/NoChatSelected.component'
import { useRoomContext } from './_hooks/consumeRoomContext'
import { FooterRoom, HeaderRoom, MessagesRoom } from './_components/RoomLayout'
import { memo, useEffect, useRef, useState } from 'react'
import { roomState } from './_reducers/types'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { ROOM_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { Heading, Spinner } from '@radix-ui/themes'
import { MAX_MESSAGES_PER_REQ } from '@chat-app/utils/globalConstants'

export default function RoomPage() {
	const {
		selectedRoom: { selectedKeyRoom },
		RoomCtx: { roomState, AddMessage }
	} = useRoomContext()

	const { responseData, isPending, makeHTTPRequest } = useCallServer<ROOM_TYPES_RESPONSES['/roomHistory']>()

	const actualRoom = roomState.get(selectedKeyRoom ?? '')

	const mainRef = useRef<HTMLElement>(null)
	const hasReachedTop = useRef<boolean>(false)
	const [scroll, setScroll] = useState<HTMLElement | null>(null)

	useEffect(() => {
		scroll?.scrollTo({ behavior: 'instant', left: 0, top: scroll?.scrollHeight })
	}, [scroll])

	if (scroll == null || mainRef.current != null)
		setTimeout(() => {
			setScroll(mainRef.current)
		}, 0)

	useEffect(() => {
		if (scroll == null || actualRoom == null) return

		function scrollEnd(e: Event) {
			const { scrollTop } = e.target as never

			if (hasReachedTop.current == false && scrollTop <= 100) {
				hasReachedTop.current = true
				makeHTTPRequest({
					rootRoute: '/room',
					subroute: '/roomHistory',
					HTTPmethod: 'POST',
					passJWT: true,
					bodyFields: [actualRoom?.roomInfo.room_id ?? '', actualRoom?.messages.length ?? 0]
				})
			}
		}

		if (actualRoom?.messages?.length ?? 0 >= MAX_MESSAGES_PER_REQ) scroll.addEventListener('scroll', scrollEnd)
		return () => {
			scroll.addEventListener('scroll', scrollEnd)
		}
	}, [scroll, makeHTTPRequest, actualRoom])

	useEffect(() => {
		if (responseData == null) return
		AddMessage({ roomInfo: responseData.room_id, newMessage: responseData.messages, order: 'asOlder' })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [responseData])

	if (actualRoom == undefined) return <NoChatSelected />
	const { room_name, room_description, room_id, room_picture } = actualRoom['roomInfo']

	return (
		<main className="relative flex flex-col w-full h-full">
			<HeaderRoom
				room_name={room_name}
				room_id={room_id}
				room_description={room_description}
				room_picture={room_picture}
			/>

			<main
				className="h-full mb-16 overflow-y-auto bg-chatBackground bg-blend-lighten bg-white/90 bg-no-repeat bg-cover bg-center [scrollbar-width:thin] relative"
				ref={mainRef}
			>
				{isPending && (
					<div className="w-full flex justify-center items-center gap-x-2 bg-neutral-200 rounded-b-sm shadow-md py-2">
						<Heading as="h3" size="3" className="!text-descriptionColor">
							Loading more messages
						</Heading>
						<Spinner size="3" className="relative w-full" />
					</div>
				)}
				<>
					<RenderMessages messages={actualRoom.messages} />
				</>
			</main>
			<FooterRoom />
		</main>
	)
}

const RenderMessages = memo(function RenderMessagesNoMemoized({ messages }: { messages: roomState['messages'] }) {
	return (
		<div className="opacity-100 p-4 w-full h-full">
			{messages.map((messageType) => {
				return <MessagesRoom key={messageType.message_id} messages={messageType} />
			})}
		</div>
	)
})
