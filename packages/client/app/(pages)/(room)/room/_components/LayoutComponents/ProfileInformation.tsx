'use client'

import { ImageAndFallback } from '@/app/_components/ImageAndFallback.component'
import { GETSessionStorage } from '@/app/_utils/sessionStorage'
import { Heading, Text } from '@radix-ui/themes'
import { memo, useEffect, useState } from 'react'
import { DialogEditProfile } from './components/DialogEditProfile'

function ProfileInformationNoMemo() {
	const [sessionStorage, setSessionStorage] = useState<ReturnType<typeof GETSessionStorage>>()
	useEffect(() => {
		setSessionStorage(GETSessionStorage())
	}, [])

	if (sessionStorage == null) return

	return (
		<footer className="flex flex-row items-center pb-5 gap-x-2 bg-neutral-100 borderLayout w-full !max-w-[350px]">
			<div className="h-14 w-14 min-h-14 min-w-14 rounded-[50%]">
				<ImageAndFallback picture={sessionStorage?.profile_picture ?? ''} altName="Your profile picture." />
			</div>

			<span className="flex flex-col !overflow-hidden w-full">
				<span className="flex flex-row items-center gap-x-1 w-full">
					<Heading as="h4" size="4" className="!overflow-hidden !text-nowrap !text-ellipsis max-w-[90%]" title="You">
						{sessionStorage.user_name ?? 'You'}
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
