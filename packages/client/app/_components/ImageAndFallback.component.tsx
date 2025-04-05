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
	renderAsBase64?: boolean
}

function ImageAndFallbackNoMemo({
	picture,
	altName,
	description,
	className,
	size = 50,
	children = null,
	renderAsBase64 = false
}: ImageAndFallback) {
	return (
		<div
			className={`relative overflow-hidden h-auto w-full ${renderAsBase64 && 'max-h[300px] max-w-[300px]'}`}
			style={{
				height: `${!renderAsBase64 && `${size}px`}`,
				width: `${!renderAsBase64 && `${size}px`}`,
				minHeight: `${size}px`,
				minWidth: `${size}px`
			}}
		>
			{picture == undefined || picture == '' ? (
				<div className="w-full h-full rounded-full border-2 bg-neutral-300 border-neutral-400" />
			) : (
				<Image
					src={renderAsBase64 ? decodeURIComponent(picture) : `${URL_DATABASE}${PUBLIC_FOLDER_NAME}${picture}`}
					onError={(event) => {
						event.currentTarget.id = '/images/fallback.png'
						event.currentTarget.srcset = '/images/fallback.png'
					}}
					width={size}
					height={size}
					alt={altName ?? ''}
					className={`w-full h-full border-2 object-cover  ${renderAsBase64 ? 'rounded-md border-transparent/10 hover:scale-105 transition-all hover:object-contain hover:border-0' : 'rounded-full border-neutral-800/30 '} ${className}`}
					title={description}
				/>
			)}

			{children != null && children}
		</div>
	)
}

export const ImageAndFallback = memo(ImageAndFallbackNoMemo)
