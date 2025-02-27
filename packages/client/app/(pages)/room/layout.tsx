'use client'

import './room.css'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons'
import { Heading } from '@radix-ui/themes'
import Link from 'next/link'
import { ReactNode, useEffect } from 'react'
import { NoChatsAvailable } from './_components/noChatsAvailable.component'
import { ChatBubble } from './_components/chatBubble.component'
import { Poppins } from 'next/font/google'
import { Root, Slot } from '@radix-ui/themes/components/text-field'
import { ROOM_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { CustomDialog } from '@/app/_components/customDialog'
import { SearchRooms } from './_components/DialogExtras'

const poppins = Poppins({
	weight: '600',
	subsets: ['latin'],
	display: 'auto'
})

export default function RoomLayout({ children }: { children: ReactNode }) {
	const { responseData, makeHTTPRequest } = useCallServer<ROOM_TYPES_RESPONSES['/allRooms']>()

	useEffect(() => {
		makeHTTPRequest({
			rootRoute: '/room',
			subroute: '/allRooms',
			passJWT: true,
			HTTPmethod: 'GET'
		})
	}, [makeHTTPRequest])

	// if (isPending) return <>Loading...</>

	return (
		<main className="flex flex-row h-screen w-screen overflow-hidden">
			<aside className="asideLayout w-1/3 shadow-lg border-r-[1px] border-r-transparent/10 max-w-[400px]">
				<nav className="py-3 flex flex-col items-center bg-slate-200">
					<Heading className={`${poppins.className}`} size="4" as="h3" weight="bold">
						ChatApp by{' '}
						<Link
							className="text-blue-500 hover:underline hover:underline-offset-2 hover:brightness-110"
							target="_blank"
							href="https://github.com/Aragon-Joaquin"
							rel="noopener noreferrer"
						>
							J.A.
						</Link>
					</Heading>
				</nav>

				<Heading
					className={`borderLayout bg-slate-100 flex flex-row justify-between items-center ${poppins.className}`}
				>
					Main chats
					<CustomDialog
						iconName={<PlusIcon />}
						title="Join room"
						description="Soon i'll implement the ability to search & filter public rooms, for now, just ask your friends what's the room code."
						mainComponent={<SearchRooms />}
					/>
				</Heading>

				<section className="bg-slate-200 p-2">
					<Root size="3" placeholder="Search chats." variant="surface" radius="large">
						<Slot>
							<MagnifyingGlassIcon />
						</Slot>
					</Root>
				</section>

				<main className="borderLayout overflow-y-auto h-full bg-slate-100">
					{responseData?.at(1) == 0 ? (
						<NoChatsAvailable />
					) : (
						responseData?.map((roomInfo, idx) => {
							return <ChatBubble key={idx} roomInfo={roomInfo} />
						})
					)}
				</main>
			</aside>
			<div>{children}</div>
		</main>
	)
}
