import { CustomDialog } from '@/app/_components/customDialog'
import { Heading, Text } from '@radix-ui/themes'
import { SearchRooms } from './DialogExtras'

export function NoChatsAvailable() {
	return (
		<aside className="flex flex-col w-fit m-auto items-center pt-5 gap-y-2 !bg-neutral-400/30 p-2 rounded-md">
			<Heading as="h3" size="4" weight="regular" align="center">
				Looking someone to talk?
				<Text as="p" color="gold" weight="medium">
					Start searching for a room!
				</Text>
			</Heading>
			<CustomDialog iconComponent={<>Join Room</>} iconName="JoinRoom" mainComponent={<SearchRooms />} />
		</aside>
	)
}
