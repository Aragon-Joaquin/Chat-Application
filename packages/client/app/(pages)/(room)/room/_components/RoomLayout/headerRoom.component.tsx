import { Heading, Text } from '@radix-ui/themes'
import { ImageAndFallback } from '@app/_components/ImageAndFallback.component'
import { ChangeEvent, memo, useCallback, useEffect, useId } from 'react'
import { useRoomContext } from '../../_hooks/consumeRoomContext'
import { RoomInfo } from '@/app/_utils/tableTypes'
import { DDMenu } from './DropDownMenu/DDMenuHeader'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { useConsumeContext } from '@/app/_hooks/consumeContext'
import { BadRequest, BadRequestCodes } from '@/app/_errors'
import { IMAGES_TYPES } from '@/app/_utils/utils'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { ROOM_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'

interface HeaderRoomProps {
	room_id: RoomInfo['room_id']
	room_name: RoomInfo['room_name']
	room_description: RoomInfo['room_description']
	room_picture: RoomInfo['room_picture']
}

function HeaderRoomNoMemo({ room_id, room_description, room_name, room_picture }: HeaderRoomProps) {
	const {
		RoomCtx: { LeaveRoom },
		webSocket: { handleWSActions }
	} = useRoomContext()

	const handleLeave = useCallback(() => {
		handleWSActions<'LEAVE'>({ action: 'leaveRoom', payload: { roomID: room_id } })
		LeaveRoom({ room_id: room_id })
	}, [LeaveRoom, handleWSActions, room_id])

	return (
		<header className="flex flex-row px-10 pl-20 items-center justify-between bg-neutral-100 w-full h-20 min-h-20 shadow-md z-10">
			<RoomHeader
				room_name={room_name}
				room_description={room_description}
				room_picture={room_picture}
				room_id={room_id}
			/>
			<div className="w-8 h-8 flex items-center justify-center">
				<DDMenu handleLeave={handleLeave} roomID={room_id} />
			</div>
		</header>
	)
}

export const HeaderRoom = memo(HeaderRoomNoMemo)

const RoomHeader = memo(function useRoomHeaderNoMemo({
	room_id,
	room_name,
	room_description,
	room_picture
}: {
	room_id: RoomInfo['room_id']
	room_name: RoomInfo['room_name']
	room_description: RoomInfo['room_description']
	room_picture: RoomInfo['room_picture']
}) {
	const idInput = useId()
	const {
		webSocket: { handleWSActions }
	} = useRoomContext()

	const { makeHTTPRequest, isPending, responseData } = useCallServer<ROOM_TYPES_RESPONSES['/uploadPhoto']>()

	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	function handleSubmit(e: ChangeEvent<HTMLInputElement>) {
		e.preventDefault()
		const file = e.currentTarget?.files?.item(0)
		if (file == null || !IMAGES_TYPES.includes(file?.type))
			return setUIError(new BadRequest('Type of image not valid.', BadRequestCodes.BAD_REQUEST))

		const imageFile = new FormData()
		imageFile.append('file', file)
		imageFile.append('roomID', room_id)

		makeHTTPRequest({
			rootRoute: '/room',
			subroute: '/uploadPhoto',
			HTTPmethod: 'POST',
			formData: imageFile,
			passJWT: true
		})
	}

	useEffect(() => {
		if (responseData == null) return
		handleWSActions<'SEND_MEDIA'>({
			action: 'sendMediaFiles',
			payload: { file: responseData, type: { action: 'roomPicture', roomPicture: { roomID: room_id } } }
		})
	}, [responseData, handleWSActions, room_id])

	return (
		<aside className="flex flex-row gap-x-4">
			<ImageAndFallback picture={room_picture ?? ''} description={room_description ?? ''} size={60}>
				<form
					className="h-full w-full bg-transparent/60 inset-0 absolute transition-all opacity-0 flex justify-center items-center
				hover:cursor-pointer hover:!opacity-100"
				>
					<label htmlFor={idInput} className="w-full h-full hover:cursor-pointer relative">
						<input
							type="file"
							id={idInput}
							accept="image/png, image/jpeg"
							className="pointer-events-none invisible"
							disabled={isPending}
							onChange={(e) => handleSubmit(e)}
						/>
					</label>
					<Pencil1Icon
						color="#ffc53d"
						className="absolute pointer-events-none top-0 left-0 translate-x-[40%] translate-y-[40%] w-8 h-8 z-50"
					/>
				</form>
			</ImageAndFallback>

			<span className="flex flex-col gap-y-1">
				<Heading as="h2">{room_name}</Heading>
				<Text as="p" className="text-descriptionColor">
					{room_description ?? 'Not description yet.'}
				</Text>
			</span>
		</aside>
	)
})
