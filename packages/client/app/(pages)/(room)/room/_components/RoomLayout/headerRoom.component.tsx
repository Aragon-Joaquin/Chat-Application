import { Heading, IconButton, Text } from '@radix-ui/themes'

import { roomState } from '../../_reducers/types'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { ImageAndFallback } from '@app/_components/ImageAndFallback.component'
import { Root, Trigger, Content, Item } from '@radix-ui/themes/components/dropdown-menu'
import { memo } from 'react'
import { useRoomContext } from '../../_hooks/consumeRoomContext'

function HeaderRoomNoMemo({ room }: { room: roomState['roomInfo'] }) {
	const {
		RoomCtx: { LeaveRoom },
		webSocket: { handleWSActions }
	} = useRoomContext()

	function handleLeave() {
		handleWSActions<'LEAVE'>({ action: 'leaveRoom', payload: { roomID: room.room_id } })
		LeaveRoom({ room_id: room.room_id })
	}

	return (
		<header className="flex flex-row px-10 pl-20 items-center justify-between bg-neutral-100 w-full h-20 min-h-20 shadow-md z-10">
			<aside className="flex flex-row gap-x-4">
				<div className="w-16 h-16 ">
					<ImageAndFallback picture={room?.room_picture ?? ''} description={room.room_description ?? ''} />
				</div>
				<span className="flex flex-col gap-y-1">
					<Heading as="h2">{room.room_name}</Heading>
					<Text as="p" className="text-descriptionColor">
						{room.room_description ?? 'Not description yet.'}
					</Text>
				</span>
			</aside>

			<div className="w-8 h-8 flex items-center justify-center">
				<Root>
					<Trigger>
						<IconButton variant="ghost" className="!w-full !h-full">
							<DotsVerticalIcon className="w-full h-full svgOnHover" />
						</IconButton>
					</Trigger>
					<Content>
						<Item color="red" className="hover:cursor-pointer" onClick={handleLeave}>
							Leave
						</Item>
					</Content>
				</Root>
			</div>
		</header>
	)
}

export const HeaderRoom = memo(HeaderRoomNoMemo)
