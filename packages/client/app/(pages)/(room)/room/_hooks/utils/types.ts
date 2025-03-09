import { WS_ACTIONS } from '@chat-app/utils/globalConstants'

type SelectWSAction<T extends keyof typeof WS_ACTIONS> = (typeof WS_ACTIONS)[T]

export type wsPayloads =
	| { action: SelectWSAction<'JOIN'>; payload: { roomID: string; roomPassword: string | '' } }
	| { action: SelectWSAction<'LEAVE'>; payload: { roomID: string } }
	| { action: SelectWSAction<'DELETE'>; payload: { messageID: string; roomID: string } }
	| { action: SelectWSAction<'SEND'>; payload: { messageString: string; roomID: string; file?: string } }

export type PICK_WS_PAYLOAD<T extends keyof typeof WS_ACTIONS> = Extract<
	wsPayloads,
	{ action: (typeof WS_ACTIONS)[T] }
>['payload']
