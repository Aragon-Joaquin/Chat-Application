import { callServer } from '@/app/_utils/callServer'
import { notFound } from 'next/navigation'

export default async function RoomDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	if (!slug) return notFound()

	const response: Array<unknown> = await callServer({
		HTTPMethod: 'GET',
		endpoint: { room: '/roomhistory' },
		passJWT: true,
		bodyFields: [slug, 20, 0]
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
