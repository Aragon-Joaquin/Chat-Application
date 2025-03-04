import { SimpleForm } from '@/app/_components/SimpleForm.component'
import { List, Root, Trigger, Content } from '@radix-ui/react-tabs'
import { Heading, Text } from '@radix-ui/themes'

const JOINROOM_VALUE = 'joinRoom' as const
const CREATEROOM_VALUE = 'createRoom' as const

export function SearchRooms() {
	return (
		<Root className="w-[300px]">
			<List className="grid grid-cols-2 grid-rows-1 mb-4 border-2 border-neutral-300 rounded-md divide-x-2 divide-neutral-300 mr-8 font-medium bg-neutral-100 font-sans">
				<Trigger value={JOINROOM_VALUE} className="data-[state=active]:bg-neutral-300 transition-all">
					Join Room
				</Trigger>
				<Trigger value={CREATEROOM_VALUE} className="data-[state=active]:bg-neutral-300 transition-all">
					Create Room
				</Trigger>
			</List>

			<Content value={JOINROOM_VALUE} className="flex flex-col items-center">
				<ContentSimplifier
					title="Join Room"
					description="Soon i'll implement the ability to search & filter public rooms, for now, just ask your friends what's the room code."
				/>

				<SimpleForm
					httpReq={{ rootRoute: '/room', subroute: '/', HTTPmethod: 'GET', passJWT: true }}
					arrayOfFields={[
						{ fieldName: 'room_name', labelName: 'Room Code', inputType: 'text', requiredField: true },
						{ fieldName: 'room_password', labelName: 'Password', inputType: 'password' }
					]}
				/>
			</Content>
			<Content value={CREATEROOM_VALUE} className="flex flex-col items-center ">
				<ContentSimplifier title="Create Room" description="Create a room to start chatting! (password is optional)" />

				<SimpleForm
					httpReq={{ rootRoute: '/room', subroute: '/', HTTPmethod: 'POST', passJWT: true }}
					arrayOfFields={[
						{ fieldName: 'room_name', labelName: 'Room Name', inputType: 'text', requiredField: true },
						{ fieldName: 'room_password', labelName: 'Room Password (optional)', inputType: 'password' }
					]}
				/>
			</Content>
		</Root>
	)
}

function ContentSimplifier({ title, description }: { title: string; description: string }) {
	return (
		<div className="flex flex-col w-full justify-start mb-4">
			<Heading as="h2" className="!font-bold !text-xl !mb-2 !-ml-2">
				{title}
			</Heading>
			<Text className="text-descriptionColor w-full">{description}</Text>
		</div>
	)
}
