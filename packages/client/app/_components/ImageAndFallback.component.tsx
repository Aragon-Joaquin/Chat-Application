import Image from 'next/image'
import { memo, ReactNode } from 'react'
import { URL_DATABASE } from '../_utils/utils'
import { PUBLIC_FOLDER_NAME } from '@chat-app/utils/globalConstants'

interface ImageAndFallback {
	picture: string | ''
	altName?: string
	description?: string
	className?: string
	size?: 50 | 60 | 70 | 80 | 90 | 130
	children?: ReactNode
}

function ImageAndFallbackNoMemo({
	picture,
	altName,
	description,
	className,
	size = 50,
	children = null
}: ImageAndFallback) {
	return (
		<div
			className={`rounded-[50%] relative overflow-hidden`}
			style={{ height: `${size}px`, width: `${size}px`, minHeight: `${size}px`, minWidth: `${size}px` }}
		>
			{picture == undefined || picture == '' ? (
				<div className="w-full h-full rounded-full border-2 bg-neutral-300  border-neutral-400" />
			) : (
				<Image
					src={`${URL_DATABASE}${PUBLIC_FOLDER_NAME}${picture}`}
					onError={(event) => {
						event.currentTarget.id = '/images/fallback.png'
						event.currentTarget.srcset = '/images/fallback.png'
					}}
					width={size}
					height={size}
					alt={altName ?? ''}
					className={`w-full h-full rounded-full border-2 border-neutral-800/30 ${className}`}
					title={description}
				/>
			)}

			{children != null && children}
		</div>
	)
}

export const ImageAndFallback = memo(ImageAndFallbackNoMemo)
