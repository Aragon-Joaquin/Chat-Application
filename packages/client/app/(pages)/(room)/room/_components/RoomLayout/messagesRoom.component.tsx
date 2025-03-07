import { Heading, Text } from '@radix-ui/themes'
import { Messages } from '../../_reducers/types'
import { ImageAndFallback } from '@app/_components/ImageAndFallback.component'

export function MessagesRoom({ messages }: { messages: Messages }) {
	const { userProps, message_id, message_content, file_id } = messages

	return (
		<span>
			<ImageAndFallback
				picture={userProps.profile_picture ?? ''}
				altName={userProps.user_name}
				description={`Image of ${userProps.user_name}`}
			/>
			<Heading as="h5">{userProps?.user_name}</Heading>
			<Text as="p">{String.raw`${message_content ?? ''}`}</Text>
		</span>
	)
}
