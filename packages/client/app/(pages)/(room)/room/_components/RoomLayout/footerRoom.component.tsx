'use client'

import { ImageIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { FormEvent, useRef } from 'react'
import { IconButton } from '@radix-ui/themes'
import { useRoomContext } from '../../_hooks/consumeRoomContext'
import { CREATE_CLIENT_UUID } from '@/app/_utils/utils'

const MESSAGE_NAME = 'MESSAGE_SENDER' as const

export function FooterRoom() {
	const inputRef = useRef<HTMLInputElement>(null)
	const {
		webSocket: { handleWSActions },
		RoomCtx: { AddOwnMessage, roomState },
		selectedRoom: { selectedKeyRoom }
	} = useRoomContext()

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const data = new FormData(e.currentTarget).get(MESSAGE_NAME)?.toString()

		if (data == '' || selectedKeyRoom == undefined) return
		if (inputRef.current != null) inputRef.current.value = ''

		const actualRoom = roomState.get(selectedKeyRoom)!
		const createdID = CREATE_CLIENT_UUID()
		AddOwnMessage({
			roomInfo: actualRoom['roomInfo']['room_id'],
			ownMessage: { message_content: `${data}` },
			client_id: createdID
		})

		handleWSActions<'SEND'>({
			action: 'sendMessage',
			payload: {
				messageString: String.raw`${data}`,
				roomID: actualRoom['roomInfo']['room_id'],
				own_message: true,
				client_id: createdID
			}
		})
	}

	return (
		<footer className="absolute bottom-0 right-0 flex flex-row justify-center gap-x-2 bg-neutral-100 border-t-[1px] border-transparent/10 w-full h-16 items-center">
			<IconButton
				className="!shadow-none"
				type="submit"
				size="3"
				asChild={false}
				radius="medium"
				variant="outline"
				title="Share photos"
			>
				<ImageIcon height={0} width={0} className="w-auto h-full svgOnHover" />
			</IconButton>

			<form className="flex flex-row w-1/2 h-full items-center relative" onSubmit={(e) => handleSubmit(e)}>
				<input
					type="text"
					placeholder="Start typing what you wanna say here!"
					autoComplete="off"
					name={MESSAGE_NAME}
					ref={inputRef}
					className="pl-4 pr-10 font-normal py-2 rounded-lg w-full border-2 border-transparent/10 focus:!outline-blue-300 focus:!bg-blue-200/20"
				/>

				<IconButton
					className="!absolute !right-0 !-translate-x-1 !w-9 !h-9"
					type="submit"
					asChild={false}
					radius="medium"
					variant="soft"
					title="Send message"
				>
					<PaperPlaneIcon height={0} width={0} className="w-auto h-full svgOnHover" />
				</IconButton>
			</form>
		</footer>
	)
}
