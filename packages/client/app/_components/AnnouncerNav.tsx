import { Cross1Icon } from '@radix-ui/react-icons'
import { Heading, HeadingProps, IconButton } from '@radix-ui/themes'
import { memo, useState } from 'react'

interface NotificationAnnouncerProps {
	titleName: string
	color: 'Error' | 'Info' | 'Warn'
}

const ColorsHashMap: Record<NotificationAnnouncerProps['color'], HeadingProps['color']> = {
	Error: 'ruby',
	Info: 'blue',
	Warn: 'amber'
} as const

function AnnouncerNavNoMemo({ titleName, color }: NotificationAnnouncerProps) {
	const [isClosed, setIsClosed] = useState<boolean>(false)

	if (isClosed) return
	return (
		<header className="flex justify-center items-center fixed w-full h-14 bg-neutral-100 rounded-b-md z-50 border-b-2 border-transparent/20">
			<Heading
				as="h3"
				size="4"
				color={color != undefined ? ColorsHashMap[color] : 'gray'}
				weight="bold"
				className="!font-poppins"
			>
				{titleName ?? 'Unknown announcer message.'}
			</Heading>
			<IconButton
				variant="soft"
				color="iris"
				onClick={() => setIsClosed(true)}
				className="!absolute !top-0 !right-2 !translate-y-1/3 hover:cursor-pointer hover:scale-110 !transition-all"
			>
				<Cross1Icon />
			</IconButton>
		</header>
	)
}

export const AnnouncerNav = memo(AnnouncerNavNoMemo)
