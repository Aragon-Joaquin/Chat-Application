'use client'

import { ReactNode, useCallback, useEffect, useState } from 'react'

import { RoomContext } from './context'
import { WS_ACTIONS, WS_ENDPOINTS_EVENTS } from '@chat-app/utils/globalConstants'
import { WS_ENDPOINTS_TYPES } from './types'
import { BadRequest } from '@/app/_errors'
import { useConsumeContext } from '@/app/_hooks/consumeContext'
import { AnnouncerNav } from '@/app/_components/AnnouncerNav'
import { useWebsocket } from '../_hooks/useWebsocket'
import { useRoomReducer } from './hooks/dispatchReducer.hook'
import { roomState } from '../_reducers/types'
import { UserInfo } from '@/app/_utils/tableTypes'

export function GetRoomContext({ children }: { children: ReactNode }) {
	const {
		roomState,
		userState,
		ModifyUser,
		ModifyRoom,
		AddUsers,
		AddRoom,
		AddMultipleRooms,
		AddMessage,
		AddOwnMessage,
		ModifyMessage,
		LeaveRoom,
		DeleteMessage
	} = useRoomReducer()

	const { wsSocket, setWsSocket, handleWSActions } = useWebsocket()

	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	//! it saves the id to then find the user
	const [currentUser, setCurrentUser] = useState<UserInfo['user_id']>()

	//! set selectedRoom state
	const [selectedKeyRoom, setSelectedKeyRoom] = useState<string>()

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
			const { new_message, from_user_id, roomID, client_id, date_sended }: WS_ENDPOINTS_TYPES['sendMessage'] =
				JSON.parse(data)

			if (client_id != undefined)
				return ModifyMessage({
					roomInfo: roomID,
					message: { ...new_message, sender_id: from_user_id, messageStatus: 'sended', date_sended },
					client_id: client_id
				})

			AddMessage({
				roomInfo: roomID,
				newMessage: {
					...new_message,
					date_sended,
					sender_id: from_user_id
				}
			})
		}
		function handlerErrors(data: string) {
			const { error_name, error_code }: WS_ENDPOINTS_TYPES['errorChannel'] = JSON.parse(data)
			setUIError(new BadRequest(error_name, error_code))
		}

		function handlerJoin(data: string) {
			const parsedData: WS_ENDPOINTS_TYPES['joinedRoom'] = JSON.parse(data)
			if ('user_id' in parsedData) {
				AddUsers(parsedData)
				AddMessage({
					newMessage: { type: 'server', message_content: `${parsedData?.user_name ?? '???'} has joined the room.` },
					roomInfo: parsedData.room_id
				})
			} else {
				AddRoom(parsedData)
				AddMessage({
					newMessage: { type: 'server', message_content: `You joined the room!` },
					roomInfo: parsedData.room_id
				})
			}
		}

		function handleMediaChannel(data: string) {
			const parsedData: WS_ENDPOINTS_TYPES['sendMediaFiles'] = JSON.parse(data)
			console.log({ parsedData })
			if (parsedData.type === 'roomPicture')
				return ModifyRoom({ roomID: parsedData.roomID, newProps: { room_picture: parsedData.fileSrc } })
			if (parsedData.type === 'userPicture')
				return ModifyUser({ userID: parsedData.clientID, newProps: { profile_picture: parsedData.fileSrc } })

			//! this needs more information
			if (parsedData.type === 'chatIMG') {
				const image = new Image()
				image.onload = function () {
					console.log(image.width) // image is loaded and we have image width
				}
				image.src = parsedData.fileSrc
				document.body.appendChild(image)

				return AddMessage({
					roomInfo: parsedData.roomID,
					newMessage: { sender_id: parsedData.clientID, message_content: '', file_id: 'base64ToImage' }
				})
			}
		}
		wsSocket.on(WS_ENDPOINTS_EVENTS.MESSAGE, handlerMessage)
		wsSocket.on(WS_ENDPOINTS_EVENTS.ERROR_CHANNEL, handlerErrors)
		wsSocket.on(WS_ENDPOINTS_EVENTS.CREATE_ROOM, handlerJoin)
		wsSocket.on(WS_ENDPOINTS_EVENTS.JOINED_ROOM, handlerJoin)
		wsSocket.on(WS_ENDPOINTS_EVENTS.MEDIA_CHANNEL, handleMediaChannel)
		wsSocket.on('disconnect', () => {
			setUIError(new Error('WebSocket has been disconnected. Please reload the page again. '))
		})

		return () => {
			wsSocket?.disconnect()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [wsSocket])

	return (
		<RoomContext.Provider
			value={{
				RoomCtx: {
					roomState,
					userState,
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
				currentUser: {
					currentUser,
					setCurrentUser
				},
				webSocket: {
					wsSocket,
					setWsSocket,
					handleWSActions
				}
			}}
		>
			{wsSocket?.active === false && (
				<AnnouncerNav
					color="Error"
					titleName="WebSocket has been disconnected. Please reload the page or you won't be able to chat until so. "
				/>
			)}
			{children}
		</RoomContext.Provider>
	)
}
