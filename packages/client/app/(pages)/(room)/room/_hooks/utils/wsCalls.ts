//! IO does not have an inference nor type defined in the documentation

import { io, Socket } from 'socket.io-client'
import { URL_WS } from '../../../../../_utils/utils'
import { WS_ACTIONS, WS_NAMESPACE } from '@chat-app/utils/globalConstants'
import { getJWT } from '../../../../../_utils/JWTMethods'
import { PICK_WS_PAYLOAD } from './types'

export const createSocket = async () =>
	io(`${URL_WS}/${WS_NAMESPACE}`, {
		transports: ['websocket'],
		auth: { Authorization: `Bearer ${await getJWT()}` },
		autoConnect: true
	})

export const HASHMAP_WSACTIONS = {
	[WS_ACTIONS.SEND]: function (socket: Socket, payload: PICK_WS_PAYLOAD<'SEND'>) {
		socket.emit(WS_ACTIONS.SEND, {
			messageString: payload.messageString ?? '',
			roomID: payload.roomID ?? '',
			messageID: payload.client_id ?? '',
			own_message: payload.own_message ?? false,
			...(payload?.file != undefined && { file: payload.file })
		})
	},
	[WS_ACTIONS.JOIN]: function (socket: Socket, payload: PICK_WS_PAYLOAD<'JOIN'>) {
		socket.emit(WS_ACTIONS.JOIN, { roomID: payload.roomID ?? '', roomPassword: payload.roomPassword ?? '' })
	},
	[WS_ACTIONS.LEAVE]: function (socket: Socket, payload: PICK_WS_PAYLOAD<'LEAVE'>) {
		socket.emit(WS_ACTIONS.LEAVE, { roomID: payload.roomID ?? '' })
	},
	[WS_ACTIONS.DELETE]: function (socket: Socket, payload: PICK_WS_PAYLOAD<'DELETE'>) {
		socket.emit(WS_ACTIONS.DELETE, { messageID: payload.messageID ?? '', roomID: payload.roomID ?? '' })
	}
}
