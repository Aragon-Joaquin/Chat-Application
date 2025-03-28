import Image from 'next/image'
import { memo } from 'react'
import { URL_DATABASE } from '../_utils/utils'
import { PUBLIC_FOLDER_NAME } from '@chat-app/utils/globalConstants'

interface ImageAndFallback {
	picture: string | ''
	altName?: string
	description?: string
	className?: string
}

function ImageAndFallbackNoMemo({ picture, altName, description, className }: ImageAndFallback) {
	if (picture == undefined || picture == '')
		return <div className="w-full h-full rounded-full border-2 bg-neutral-300  border-neutral-400" />

	return (
		<Image
			src={`${URL_DATABASE}${PUBLIC_FOLDER_NAME}${picture}`}
			loading="lazy"
			onError={(event) => {
				event.currentTarget.id = '/images/fallback.png'
				event.currentTarget.srcset = '/images/fallback.png'
			}}
			width="20"
			height="20"
			alt={altName ?? ''}
			className={`w-full h-full rounded-full border-2 border-neutral-800/30 ${className}`}
			title={description}
		/>
	)
}

export const ImageAndFallback = memo(ImageAndFallbackNoMemo)
