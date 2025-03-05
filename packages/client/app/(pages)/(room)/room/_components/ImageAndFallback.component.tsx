import Image from 'next/image'
import { roomState } from '../_reducers/types'

export default function ImageAndFallback({ roomInfo }: { roomInfo: roomState['roomInfo'] }) {
	if (roomInfo.room_picture == undefined)
		return <div className="w-full h-full bg-neutral-300 rounded-full border-2 border-neutral-400" />

	return (
		<Image
			src={roomInfo.room_picture}
			alt={`${roomInfo.room_name}`}
			className={`${roomInfo.room_description}`}
			title="Group Image"
		/>
	)
}
