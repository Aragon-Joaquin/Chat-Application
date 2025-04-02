import { roomState } from '@/app/(pages)/(room)/room/_reducers/types'
import { REQUEST_SHAPE } from './utils'
import { Messages, RoomInfo, UserInfo } from '../tableTypes'

type ROOM_ROUTES = '/' | '/roomHistory' | '/allRooms' | '/uploadPhoto'

export interface ROOM_TYPES_RESPONSES {
	'/': null
	'/roomHistory': { room_id: RoomInfo['room_id']; messages: Messages[] }
	'/allRooms': { roomInfo: roomState[]; userInfo: UserInfo[]; currentUser: UserInfo }
	'/uploadPhoto': string
}

export const ROOM_REQUEST: REQUEST_SHAPE<ROOM_ROUTES> = {
	rootRoute: '/room',
	listOfSubRoutes: {
		'/': {
			GET: {
				passJWT: false,
				bodyParametersName: []
			},
			POST: {
				passJWT: true,
				bodyParametersName: ['room_name', 'room_password']
			}
		},
		'/roomHistory': {
			POST: {
				passJWT: true,
				bodyParametersName: ['room_id', 'offset']
			}
		},
		'/allRooms': {
			GET: {
				passJWT: true,
				bodyParametersName: [] //maybe limit someday
			}
		},
		'/uploadPhoto': {
			POST: {
				passJWT: true,
				bodyParametersName: [],
				fileName: 'file'
			}
		}
	}
}
