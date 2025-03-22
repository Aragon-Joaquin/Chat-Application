import Image from 'next/image'
import { memo } from 'react'
import { GET_FILES_FOLDER } from '../_utils/utils'
interface ImageAndFallback {
	picture: string | ''
	altName?: string
	description?: string
	className?: string
}

function ImageAndFallbackNoMemo({ picture, altName, description, className }: ImageAndFallback) {
	console.log({ picture, altName, description })

	const getFolder = GET_FILES_FOLDER(picture)
	console.log({ getFolder })
	if (getFolder == undefined)
		return <div className="w-full h-full rounded-full border-2 bg-neutral-300  border-neutral-400" />

	return (
		<Image
			src={`../../../uploads/1742603442793-wekito.jpg`}
			width="20"
			height="20"
			alt={altName ?? ''}
			className={`w-full h-full rounded-full ${className}`}
			title={description}
		/>
	)
}

export const ImageAndFallback = memo(ImageAndFallbackNoMemo)
