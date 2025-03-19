import { RoomInfo } from '@/app/_utils/tableTypes'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { DropdownMenu, IconButton } from '@radix-ui/themes'
import { Separator, Trigger, Content, Item } from '@radix-ui/themes/components/dropdown-menu'
import { useState, MouseEvent } from 'react'

interface DDMenuProps {
	handleLeave: () => void
	roomID: RoomInfo['room_id']
}

export function DDMenu({ handleLeave, roomID }: DDMenuProps) {
	const [isIDVisible, setIsIDVisible] = useState<boolean>(false)

	const handleState = (e: MouseEvent) => {
		e.preventDefault()
		setIsIDVisible((prevState) => !prevState)
	}
	return (
		<DropdownMenu.Root onOpenChange={() => setIsIDVisible(false)}>
			<Trigger>
				<IconButton variant="ghost" className="!w-full !h-full">
					<DotsVerticalIcon className="w-full h-full svgOnHover" />
				</IconButton>
			</Trigger>
			<Content>
				<Item onClick={(e) => handleState(e)} color="indigo" className="hover:cursor-pointer">
					{!isIDVisible ? 'RoomID' : roomID}
				</Item>

				<Separator />

				<Item color="red" className="hover:cursor-pointer flex justify-center" onClick={handleLeave}>
					Leave
				</Item>
			</Content>
		</DropdownMenu.Root>
	)
}
