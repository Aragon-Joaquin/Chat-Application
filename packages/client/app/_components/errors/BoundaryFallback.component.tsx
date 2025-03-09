import { Heading, Strong, Text } from '@radix-ui/themes'
import Link from 'next/link'

export function BoundaryFallback() {
	return (
		<main className="w-screen h-screen flex flex-col gap-y-10 justify-center items-center bg-neutral-200 relative">
			<span className="flex flex-col gap-y-2 items-center !font-poppins">
				<Heading as="h1" size="9" className="!text-3xl !font-semibold">
					Woah, Hold up there.
				</Heading>
				<Text as="p" className="!text-xl !font-medium !bg-red-300 p-2 rounded" color="ruby">
					This wasn&apos;t suppose to happen!
				</Text>
			</span>
			<Text as="p" className="max-w-[50%] !font-sans !text-xl text-descriptionColor text-center">
				An unexpected <Strong className="text-red-600 !font-semibold">Error</Strong> has occurred and the only way to
				temporally fix it is going back to the{' '}
				<Link
					href="/login"
					className="text-blue-500 font-semibold underline underline-offset-4 decoration-2 transition-all hover:brightness-125"
				>
					login
				</Link>{' '}
				page again.
			</Text>

			<Text
				as="span"
				className="fixed right-1/2 bottom-0 -translate-y-full translate-x-1/2 max-w-[60%] text-center text-neutral-700 font-mono"
			>
				If the problem keeps persisting, please, send me a DM on one of my socials in my{' '}
				<Link
					target="_blank"
					href="https://github.com/Aragon-Joaquin"
					rel="noopener noreferrer"
					className="font-bold text-black cursor-pointer hover:underline underline-offset-2 "
				>
					Github profile
				</Link>{' '}
				and I&apos;ll try my best to fix it! Thanks ⭐!
			</Text>
		</main>
	)
}
