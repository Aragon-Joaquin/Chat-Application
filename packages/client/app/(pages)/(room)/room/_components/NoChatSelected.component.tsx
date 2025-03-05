import { Heading, Text } from '@radix-ui/themes'
import Link from 'next/link'

export function NoChatSelected() {
	return (
		<aside className="w-full h-full flex flex-col gap-y-2 justify-center items-center bg-neutral-400/20">
			<Heading as="h2" size="6">
				Chat Application
			</Heading>
			<Text size={'3'} className="text-descriptionColor max-w-sm text-center">
				Start chatting by clicking one of the groups or start joining one!
			</Text>

			<footer className="fixed bottom-0 -translate-y-1/2">
				<Text as="p" size="2" className="cursor-default">
					Project made by{' '}
					<Link
						target="_blank"
						href="https://github.com/Aragon-Joaquin"
						rel="noopener noreferrer"
						className="font-bold cursor-pointer hover:underline underline-offset-2 "
					>
						Aragon Joaquin
					</Link>
					.
				</Text>
			</footer>
		</aside>
	)
}
