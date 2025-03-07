import Image from 'next/image'
interface ImageAndFallback {
	picture: string | ''
	altName?: string
	description?: string
	className?: string
}

export function ImageAndFallback({ picture, altName, description, className }: ImageAndFallback) {
	if (picture == undefined || picture == '')
		return <div className="w-full h-full rounded-full border-2 bg-neutral-300  border-neutral-400" />

	return (
		<Image
			src={picture}
			alt={altName ?? ''}
			className={`w-full h-full rounded-full ${className}`}
			title={description}
		/>
	)
}
