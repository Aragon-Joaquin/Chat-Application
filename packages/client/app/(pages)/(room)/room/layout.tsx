'use client'

import './room.css'
import { PlusIcon } from '@radix-ui/react-icons'
import { Heading } from '@radix-ui/themes'
import Link from 'next/link'
import { ReactNode, useEffect } from 'react'
import { NoChatsAvailable } from './_components/noChatsAvailable.component'
import { ChatBubble } from './_components/chatBubble.component'

import { ROOM_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { CustomDialog } from '@/app/_components/customDialog'
import { SearchRooms } from './_components/DialogExtras'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { useRoomContext } from './_hooks/consumeRoomContext'
import { createSocket } from './_hooks/utils/wsCalls'
import { SearchBox } from './_components/SearchBox.component'

export default function RoomLayout({ children }: { children: ReactNode }) {
	const { isPending, makeHTTPRequest, responseData } = useCallServer<ROOM_TYPES_RESPONSES['/allRooms']>()
	const {
		RoomCtx: { roomState, AddMultipleRooms },
		webSocket: { setWsSocket, wsSocket }
	} = useRoomContext()

	//todo: try to reduce all of this useEffects in two or less
	useEffect(() => {
		makeHTTPRequest({
			rootRoute: '/room',
			subroute: '/allRooms',
			passJWT: true,
			HTTPmethod: 'GET'
		})
	}, [makeHTTPRequest])

	useEffect(() => {
		async function makeSocket() {
			const socket = await createSocket()
			setWsSocket(socket)
		}
		if (wsSocket == undefined) makeSocket()
	}, [setWsSocket, wsSocket])

	useEffect(() => {
		if (responseData == null) return
		AddMultipleRooms(responseData)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [responseData])

	if (isPending) return <>Loading...</>

	return (
		<main className="flex flex-row h-screen w-screen ">
			<aside className="flex flex-col asideLayout w-1/3 shadow-lg border-r-[1px] border-r-transparent/10 overflow-y-hidden">
				<nav className="py-3 flex flex-col items-center bg-slate-200">
					<Heading className="!font-poppins" size="4" as="h3" weight="bold">
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

				<Heading className="borderLayout bg-slate-100 flex flex-row justify-between items-center !font-poppins">
					Main chats
					<CustomDialog iconComponent={<PlusIcon />} iconName="Manage Rooms" mainComponent={<SearchRooms />} />
				</Heading>

				<section className="bg-slate-200 p-2">
					<SearchBox placeholder="Search chats." />
				</section>

				<main className="borderLayout overflow-y-auto !border-b-0 h-full">
					{roomState.size == 0 ? (
						<NoChatsAvailable />
					) : (
						<ul className="flex flex-col gap-y-2">
							{[...roomState.entries()].map(([key, value]) => {
								return <ChatBubble key={key} roomAllProps={value} />
							})}
						</ul>
					)}
				</main>
			</aside>
			{children}
		</main>
	)
}
