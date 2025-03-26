import Image from 'next/image'
import { memo } from 'react'
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
			src={``}
			width="20"
			height="20"
			alt={altName ?? ''}
			className={`w-full h-full rounded-full ${className}`}
			title={description}
		/>
	)
}

export const ImageAndFallback = memo(ImageAndFallbackNoMemo)
