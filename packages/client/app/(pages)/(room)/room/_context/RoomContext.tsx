'use client'

import { ReactNode, useCallback, useEffect, useState } from 'react'
import { roomState } from '../_reducers/types'
import { useWebsocket } from '../_hooks/useWebsocket'
import { WS_ACTIONS, WS_ENDPOINTS_EVENTS } from '@chat-app/utils/globalConstants'
import { useRoomReducer } from './hooks/dispatchReducer.hook'
import { RoomContext } from './context'
import { WS_ENDPOINTS_TYPES } from './types'

export function GetRoomContext({ children }: { children: ReactNode }) {
	const { roomState, AddRoom, AddMultipleRooms, AddMessage, AddOwnMessage, ModifyMessage, LeaveRoom, DeleteMessage } =
		useRoomReducer()
	const { wsSocket, setWsSocket, handleWSActions } = useWebsocket()
	const [selectedKeyRoom, setSelectedKeyRoom] = useState<string>()

	//! set selectedRoom state
	const handleSetState = useCallback(
		(stateID: roomState['roomInfo']['room_id']) => {
			const findRoomInState = roomState.get(stateID)

			if (findRoomInState == undefined) return setSelectedKeyRoom(undefined)
			setSelectedKeyRoom(stateID)
		},
		[roomState]
	)

	//! ws functions
	useEffect(() => {
		if (wsSocket == undefined) return
		wsSocket.emit(WS_ACTIONS.JOIN_MULTIPLE)

		function handlerMessage(data: string) {
			const { new_message, own_message, roomID, client_id }: WS_ENDPOINTS_TYPES['sendMessage'] = JSON.parse(data)
			console.log(JSON.parse(data))

			if (own_message == true)
				return ModifyMessage({
					roomInfo: roomID,
					message: { ...new_message, own_message, messageStatus: 'sended' },
					client_id: client_id
				})
			AddMessage({
				roomInfo: roomID,
				newMessage: {
					message_content: new_message.message_content,
					own_message: own_message,
					file_id: new_message.file_id,
					date_sended: new_message.date_sended
				}
			})
		}
		function handlerErrors(data: string) {
			const { error_name, error_code, error_content } = JSON.parse(data)
			console.log(error_name, error_code, error_content)
		}

		wsSocket.on(WS_ENDPOINTS_EVENTS.MESSAGE, handlerMessage)
		wsSocket.on(WS_ENDPOINTS_EVENTS.ERROR_CHANNEL, handlerErrors)

		return () => {
			wsSocket?.disconnect()
			wsSocket?.off(WS_ENDPOINTS_EVENTS.MESSAGE, handlerMessage)
			wsSocket?.on(WS_ENDPOINTS_EVENTS.ERROR_CHANNEL, handlerErrors)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wsSocket])

	return (
		<RoomContext.Provider
			value={{
				RoomCtx: {
					roomState,
					AddRoom,
					AddMultipleRooms,
					AddMessage,
					AddOwnMessage,
					ModifyMessage,
					LeaveRoom,
					DeleteMessage
				},
				selectedRoom: {
					selectedKeyRoom: selectedKeyRoom,
					setSelectedKeyRoom: handleSetState
				},
				webSocket: {
					wsSocket,
					setWsSocket,
					handleWSActions
				}
			}}
		>
			{children}
		</RoomContext.Provider>
	)
}
