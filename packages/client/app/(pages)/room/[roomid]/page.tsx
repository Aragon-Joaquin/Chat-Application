import { callServer } from '@/app/_utils/callServer'
import { notFound } from 'next/navigation'

export default async function RoomDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	if (!slug) return notFound()

	const response: Array<unknown> = await callServer({
		rootRoute: '/room',
		subroute: '/roomhistory',
		HTTPmethod: 'GET',
		passJWT: true
	})

	//this will be the group chat logic, incluiding
	return (
		<div>
			{response.map((element, i) => {
				return <p key={i}>{String(element)}</p>
			})}
		</div>
	)
}
