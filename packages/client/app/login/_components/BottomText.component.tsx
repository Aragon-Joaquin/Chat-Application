import { Strong, Text } from '@radix-ui/themes'
import Link from 'next/link'

export function BottomText({
	descriptionText,
	linkTo,
	boldText
}: {
	descriptionText: string
	linkTo: string
	boldText: string
}) {
	return (
		<Text size="3" color="gray" weight={'medium'}>
			{descriptionText + ' '}
			<Link href={linkTo}>
				<Strong className="text-neutral-900 hover:underline">{boldText}</Strong>
			</Link>
		</Text>
	)
}
