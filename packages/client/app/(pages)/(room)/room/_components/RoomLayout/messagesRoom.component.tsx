import { Heading, Text } from '@radix-ui/themes'
import { Messages } from '../../_reducers/types'
import { ImageAndFallback } from '@app/_components/ImageAndFallback.component'

export function MessagesRoom({ messages }: { messages: Messages }) {
	const { profile_picture, user_name, message_content, file_id, message_id, which_room, date_sended } = messages

	return (
		<span>
			<ImageAndFallback picture={profile_picture ?? ''} altName={user_name} description={`Image of ${user_name}`} />
			<Heading as="h5">{user_name}</Heading>
			<Text as="p">{String.raw`${message_content ?? ''}`}</Text>
		</span>
	)
}
