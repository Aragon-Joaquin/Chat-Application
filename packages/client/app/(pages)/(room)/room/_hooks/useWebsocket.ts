import { WS_ACTIONS } from '@chat-app/utils/globalConstants'
import { useCallback, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { wsPayloads } from './utils/types'
import { HASHMAP_WSACTIONS } from './utils/wsCalls'
import { BadRequest, BadRequestCodes } from '@/app/_errors'
import { useConsumeContext } from '@/app/_hooks/consumeContext'

export function useWebsocket() {
	const [wsSocket, setWsSocket] = useState<Socket | null>(null)
	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	useEffect(() => {
		if (wsSocket == null) return
		console.log('Socket callback has been executed once again', wsSocket)
		wsSocket.emit(WS_ACTIONS.JOIN_MULTIPLE)

		return () => {
			wsSocket?.disconnect()
		}
	}, [wsSocket])

	//*example: HandleWSActions<'LEAVE'>({ action: 'leaveRoom', payload: { roomID: '' } })
	const HandleWSActions = useCallback(
		<T extends keyof typeof WS_ACTIONS>(type: Extract<wsPayloads, { action: (typeof WS_ACTIONS)[T] }>) => {
			if (wsSocket == null) return

			const { action, payload } = type
			const wsAction = HASHMAP_WSACTIONS[action as keyof typeof HASHMAP_WSACTIONS]
			if (wsAction == undefined)
				return setUIError(new BadRequest('Action is not implemented or not exists', BadRequestCodes.METHOD_NOT_ALLOWED))

			wsAction(wsSocket, payload as Extract<typeof wsAction, { action: T }>)
		},
		[wsSocket, setUIError]
	)

	return {
		wsSocket,
		setWsSocket,
		HandleWSActions
	}
}
