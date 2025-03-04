import { ReactNode } from 'react'
import { GetRoomContext } from './room/_context/RoomContext'

export default function RoomContext({ children }: { children: ReactNode }) {
	return <GetRoomContext>{children}</GetRoomContext>
}
