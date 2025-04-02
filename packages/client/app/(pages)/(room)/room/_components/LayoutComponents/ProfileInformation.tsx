'use client'

import { ImageAndFallback } from '@/app/_components/ImageAndFallback.component'
import { Heading, Text } from '@radix-ui/themes'
import { memo } from 'react'
import { DialogEditProfile } from './components/DialogEditProfile'
import { useRoomContext } from '../../_hooks/consumeRoomContext'

function ProfileInformationNoMemo() {
	const {
		currentUser: { currentUser },
		RoomCtx: { userState }
	} = useRoomContext()

	const actualUser = userState.get(currentUser ?? 0)
	if (actualUser == undefined) return

	return (
		<footer className="flex flex-row items-center pb-5 gap-x-2 bg-neutral-100 borderLayout w-full !max-w-[350px]">
			<ImageAndFallback picture={actualUser.profile_picture ?? ''} altName="Your profile picture." />

			<span className="flex flex-col !overflow-hidden w-full">
				<span className="flex flex-row items-center gap-x-1 w-full">
					<Heading as="h4" size="4" className="!overflow-hidden !text-nowrap !text-ellipsis max-w-[90%]" title="You">
						{actualUser.user_name ?? 'You'}
					</Heading>

					<DialogEditProfile />
				</span>

				<Text as="p" weight="regular" size="3" wrap="pretty" className="!text-descriptionColor">
					Your profile.
				</Text>
			</span>
		</footer>
	)
}

export const ProfileInformation = memo(ProfileInformationNoMemo)
