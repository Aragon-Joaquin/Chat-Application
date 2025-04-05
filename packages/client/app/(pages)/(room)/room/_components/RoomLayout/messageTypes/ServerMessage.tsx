import { Messages } from '@/app/_utils/tableTypes'
import { Heading } from '@radix-ui/themes'
import { memo } from 'react'

export const ServerMessage = memo(function ServerMessageNoMemo({
	message_content
}: {
	message_content: Messages['message_content']
}) {
	return (
		<span className="flex justify-center items-center">
			<Heading
				as="h3"
				size="3"
				weight="bold"
				color="gray"
				className="text-center text-nowrap w-3/4 bg-neutral-400/20 border border-transparent/20 px-2 py-1 my-7 rounded"
			>
				{message_content}
			</Heading>
		</span>
	)
})
