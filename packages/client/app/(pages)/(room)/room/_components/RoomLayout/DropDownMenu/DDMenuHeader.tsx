import { RoomInfo } from '@/app/_utils/tableTypes'
import { DotsVerticalIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, DropdownMenu, IconButton } from '@radix-ui/themes'
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
		<AlertDialog.Root>
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

					<Item className="hover:cursor-pointer flex justify-center">
						<AlertDialog.Trigger>
							<Button color="red">Leave</Button>
						</AlertDialog.Trigger>
					</Item>
				</Content>
			</DropdownMenu.Root>

			<AlertDialog.Content>
				<AlertDialog.Title className="!mb-1">Leave Room</AlertDialog.Title>
				<AlertDialog.Description size="3" className="!text-descriptionColor !text-pretty mb-2">
					Are you sure? This action cannot be undone unless you join the room using the credentials again.
				</AlertDialog.Description>
				<div className="flex flex-row gap-x-2">
					<AlertDialog.Cancel>
						<Button variant="soft" color="gray" className="hover:cursor-pointer">
							Cancel
						</Button>
					</AlertDialog.Cancel>
					<AlertDialog.Action>
						<Button variant="solid" color="red" className="hover:cursor-pointer" onClick={handleLeave}>
							Leave
						</Button>
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Root>
	)
}
