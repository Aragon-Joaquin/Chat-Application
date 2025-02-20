import { io, Socket } from 'socket.io-client'
import { URL_DATABASE } from '../utils'
import { WS_NAMESPACE, WS_ACTIONS } from '@chat-app/utils/globalConstants'

export const createSocket = () => io(`${URL_DATABASE}/${WS_NAMESPACE}`, { transports: ['websocket'] })

export function InitializeConnection(IO: Socket) {
	IO.on(WS_ACTIONS.JOIN_MULTIPLE, (socket) => {
		socket.emit()
	})
}
