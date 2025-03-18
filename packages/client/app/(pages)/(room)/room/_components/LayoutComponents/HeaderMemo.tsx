import { CustomDialog } from '@/app/_components/customDialog'
import { PlusIcon } from '@radix-ui/react-icons'
import { Heading } from '@radix-ui/themes'
import Link from 'next/link'
import { memo } from 'react'
import { SearchRooms } from '../DialogExtras'

export const LayoutHeader = memo(function header() {
	return (
		<>
			<nav className="py-3 flex flex-col items-center bg-slate-200">
				<Heading className="!font-poppins" size="4" as="h3" weight="bold">
					ChatApp by{' '}
					<Link
						className="text-blue-500 hover:underline hover:underline-offset-2 hover:brightness-110"
						target="_blank"
						href="https://github.com/Aragon-Joaquin"
						rel="noopener noreferrer"
					>
						J.A.
					</Link>
				</Heading>
			</nav>

			<Heading className="borderLayout bg-slate-100 flex flex-row justify-between items-center !font-poppins">
				Main chats
				<CustomDialog iconComponent={<PlusIcon />} iconName="Manage Rooms" mainComponent={<SearchRooms />} />
			</Heading>
		</>
	)
})
