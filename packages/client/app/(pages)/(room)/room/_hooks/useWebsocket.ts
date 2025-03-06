import { WS_ACTIONS } from '@chat-app/utils/globalConstants'
import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

export function useWebsocket() {
	const [wsSocket, setWsSocket] = useState<Socket | null>(null)

	useEffect(() => {
		if (wsSocket == null) return
		console.log('Socket callback has been executed once again', wsSocket)
		wsSocket.emit(WS_ACTIONS.JOIN_MULTIPLE)
	}, [wsSocket])

	return {
		wsSocket,
		setWsSocket
	}
}
