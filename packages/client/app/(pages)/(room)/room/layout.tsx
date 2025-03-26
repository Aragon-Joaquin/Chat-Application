'use client'

import './room.css'
import { memo, ReactNode, useEffect } from 'react'
import { ROOM_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { useRoomContext } from './_hooks/consumeRoomContext'
import { createSocket } from './_hooks/utils/wsCalls'
import { SearchBox } from './_components/SearchBox.component'
import { LoadingFallback } from '@/app/_components/LoadingFallback'
import { LayoutRenderChat, LayoutHeader, ProfileInformation } from './_components/LayoutComponents'

export default memo(function RoomLayout({ children }: { children: ReactNode }) {
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
		console.log({ responseData })
		AddMultipleRooms({ roomInfo: responseData?.roomInfo, userInfo: responseData?.userInfo })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [responseData])

	if (isPending) return <LoadingFallback />

	return (
		<main className="flex flex-row h-screen w-screen ">
			<aside className="flex flex-col asideLayout w-1/3 max-w-[350px] min-w-fit shadow-lg border-r-[1px] border-r-transparent/10 overflow-y-hidden">
				<LayoutHeader />

				<SearchBox placeholder="Search chats." />

				<LayoutRenderChat roomState={roomState} />
				<ProfileInformation />
			</aside>
			{children}
		</main>
	)
})
