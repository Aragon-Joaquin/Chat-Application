import { ImageIcon, PaperPlaneIcon } from '@radix-ui/react-icons'
import { useWebsocket } from '../../_hooks/useWebsocket'
import { FormEvent } from 'react'
import { IconButton } from '@radix-ui/themes'
import { useRoomContext } from '../../_hooks/consumeRoomContext'

const MESSAGE_NAME = 'MESSAGE_SENDER' as const

export function FooterRoom() {
	const { HandleWSActions } = useWebsocket()
	const {
		selectedRoom: { selectedRoom }
	} = useRoomContext()

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const data = new FormData(e.currentTarget).get(MESSAGE_NAME)
		if (data == null || selectedRoom == undefined) return
		// HandleWSActions<'SEND'>({
		// 	action: 'SEND',
		// 	payload: { messageString: String.raw`${data}`, roomID: selectedRoom['roomInfo']['room_id'] }
		// })
	}

	return (
		<footer className="flex flex-row justify-center gap-x-2 bg-neutral-100 border-t-[1px] border-transparent/10 bottom-0 w-full h-16 items-center">
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
