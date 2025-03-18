import { DropdownMenu, Heading, IconButton, Text } from '@radix-ui/themes'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { ImageAndFallback } from '@app/_components/ImageAndFallback.component'
import { memo, Profiler } from 'react'
import { useRoomContext } from '../../_hooks/consumeRoomContext'
import { RoomInfo } from '@/app/_utils/tableTypes'

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

	function handleLeave() {
		handleWSActions<'LEAVE'>({ action: 'leaveRoom', payload: { roomID: room_id } })
		LeaveRoom({ room_id: room_id })
	}

	return (
		<header className="flex flex-row px-10 pl-20 items-center justify-between bg-neutral-100 w-full h-20 min-h-20 shadow-md z-10">
			<RoomHeader room_name={room_name} room_description={room_description} room_picture={room_picture} />
			<Profiler id="dropdown rerender" onRender={(id, state) => console.log({ id, state })}>
				<div className="w-8 h-8 flex items-center justify-center">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<IconButton variant="ghost" className="!w-full !h-full">
								<DotsVerticalIcon className="w-full h-full svgOnHover" />
							</IconButton>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Item color="red" className="hover:cursor-pointer" onClick={handleLeave}>
								Leave
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</Profiler>
		</header>
	)
}

export const HeaderRoom = memo(HeaderRoomNoMemo)

const RoomHeader = memo(function roomHeaderNoMemo({
	room_name,
	room_description,
	room_picture
}: {
	room_name: RoomInfo['room_name']
	room_description: RoomInfo['room_description']
	room_picture: RoomInfo['room_picture']
}) {
	return (
		<aside className="flex flex-row gap-x-4">
			<div className="w-16 h-16 ">
				<ImageAndFallback picture={room_picture ?? ''} description={room_description ?? ''} />
			</div>
			<span className="flex flex-col gap-y-1">
				<Heading as="h2">{room_name}</Heading>
				<Text as="p" className="text-descriptionColor">
					{room_description ?? 'Not description yet.'}
				</Text>
			</span>
		</aside>
	)
})
