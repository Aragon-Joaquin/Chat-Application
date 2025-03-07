import { WS_ACTIONS } from '@chat-app/utils/globalConstants'
import { useCallback, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { wsPayloads } from './utils/types'
import { HASHMAP_WSACTIONS } from './utils/wsCalls'

export function useWebsocket() {
	const [wsSocket, setWsSocket] = useState<Socket | null>(null)

	useEffect(() => {
		if (wsSocket == null) return
		console.log('Socket callback has been executed once again', wsSocket)
		wsSocket.emit(WS_ACTIONS.JOIN_MULTIPLE)

		return () => {
			wsSocket?.disconnect()
		}
	}, [wsSocket])

	//! example:
	// HandleWSActions<'LEAVE'>({ action: 'LEAVE', payload: { roomID: '' } })
	const HandleWSActions = useCallback(
		<T extends keyof typeof WS_ACTIONS>(type: Extract<wsPayloads, { action: T }>) => {
			if (wsSocket == undefined) return
			const { action, payload } = type
			const wsAction = HASHMAP_WSACTIONS[action as keyof typeof HASHMAP_WSACTIONS]
			if (wsAction == undefined) return
			wsAction(wsSocket, payload as Extract<typeof wsAction, { action: T }>)
		},
		[wsSocket]
	)

	return {
		wsSocket,
		setWsSocket,
		HandleWSActions
	}
}
