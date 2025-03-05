import { Heading, Text } from '@radix-ui/themes'
import { roomState } from '../../_reducers/types'
import ImageAndFallback from '../ImageAndFallback.component'
import { DotsVerticalIcon } from '@radix-ui/react-icons'

export function HeaderRoom({ room }: { room: roomState['roomInfo'] }) {
	return (
		<header className="flex flex-row px-10 pl-20 items-center justify-between bg-neutral-100 w-full h-20 shadow-md">
			<aside className="flex flex-row gap-x-4">
				<div className="w-16 h-16 ">
					<ImageAndFallback roomInfo={room} />
				</div>
				<span className=" flex flex-col gap-y-1">
					<Heading as="h2">{room.room_name}</Heading>
					<Text as="p" className="text-descriptionColor">
						{room.room_description ?? 'Not description yet.'}
					</Text>
				</span>
			</aside>

			<div className="w-8 h-8">
				<DotsVerticalIcon height={0} width={0} className="w-full h-full svgOnHover" />
			</div>
		</header>
	)
}
