'use client'

import { ImageIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { ChangeEvent, FormEvent, useEffect, useId, useRef } from 'react'
import { IconButton } from '@radix-ui/themes'
import { useRoomContext } from '../../_hooks/consumeRoomContext'
import { CREATE_CLIENT_UUID, IMAGE_FILE_NAME, IMAGES_TYPES } from '@/app/_utils/utils'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { ROOM_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { useConsumeContext } from '@/app/_hooks/consumeContext'
import { BadRequest, BadRequestCodes } from '@/app/_errors'

const MESSAGE_NAME = 'MESSAGE_SENDER' as const

export function FooterRoom() {
	const inputRef = useRef<HTMLInputElement>(null)
	const inputID = useId()

	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	const {
		webSocket: { handleWSActions },
		RoomCtx: { AddOwnMessage, roomState },
		selectedRoom: { selectedKeyRoom }
	} = useRoomContext()

	const { makeHTTPRequest, responseData, isPending } = useCallServer<ROOM_TYPES_RESPONSES['/uploadChatPhoto']>()

	const actualRoom = roomState.get(selectedKeyRoom ?? '')

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const data = new FormData(e.currentTarget).get(MESSAGE_NAME)?.toString()

		if (data == '' || actualRoom == undefined) return
		if (inputRef.current != null) inputRef.current.value = ''

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
				client_id: createdID
			}
		})
	}

	const handleSubmitImage = (e: ChangeEvent<HTMLInputElement>) => {
		console.log(e)
		e.preventDefault()
		const file = e.currentTarget?.files?.item(0)
		if (file == null || !IMAGES_TYPES.includes(file?.type) || actualRoom == undefined)
			return setUIError(new BadRequest('Type of image not valid.', BadRequestCodes.BAD_REQUEST))

		const imageFile = new FormData()
		imageFile.append(IMAGE_FILE_NAME, file)
		imageFile.append('roomID', actualRoom['roomInfo']['room_id'])

		makeHTTPRequest({
			rootRoute: '/room',
			subroute: '/uploadChatPhoto',
			HTTPmethod: 'POST',
			formData: imageFile,
			passJWT: true
		})
	}

	useEffect(() => {
		if (responseData == null || actualRoom == undefined) return
		handleWSActions<'SEND_MEDIA'>({
			action: 'sendMediaFiles',
			payload: {
				file: responseData,
				type: { action: 'chatIMG', chatIMG: { roomID: actualRoom['roomInfo']['room_id'] ?? '' } }
			}
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleWSActions, responseData])

	return (
		<footer className="absolute bottom-0 right-0 flex flex-row justify-center gap-x-2 bg-neutral-100 border-t-[1px] border-transparent/10 w-full h-16 items-center">
			<label htmlFor={inputID} className={`z-50 cursor-pointer !p-0 svgOnHover ${isPending && '!pointer-events-none'}`}>
				<IconButton
					className="!shadow-none !pointer-events-none"
					type="submit"
					size="3"
					asChild={false}
					radius="medium"
					variant="outline"
					title="Share photos"
					disabled={isPending}
				>
					<ImageIcon height={0} width={0} className="w-auto h-full !p-1" />
					<input
						type="file"
						name={IMAGE_FILE_NAME}
						id={inputID}
						accept="image/*"
						hidden
						onChange={(e) => handleSubmitImage(e)}
					/>
				</IconButton>
			</label>

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
