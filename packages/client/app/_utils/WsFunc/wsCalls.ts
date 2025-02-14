import { io, Socket } from 'socket.io-client'
import { URL_DATABASE } from '../utils'
import { WS_NAMESPACE } from 'globalConstants'

export const createSocket = () => io(`${URL_DATABASE}/${WS_NAMESPACE}`, { transports: ['websocket'] })

export function InitializeConnection(IO: Socket, roomID: string) {
	IO.on('connection', (socket) => {
		// socket.join(roomID)
	})
}
