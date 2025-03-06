//! IO does not have an inference nor type defined in the documentation

import { io } from 'socket.io-client'
import { URL_WS } from '../utils'
import { WS_NAMESPACE } from '@chat-app/utils/globalConstants'
import { getJWT } from '../JWTMethods'

export const createSocket = async () =>
	io(`${URL_WS}/${WS_NAMESPACE}`, {
		transports: ['websocket'],
		auth: { Authorization: `Bearer ${await getJWT()}` },
		autoConnect: true
	})
