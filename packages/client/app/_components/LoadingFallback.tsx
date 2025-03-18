import { Heading, Text } from '@radix-ui/themes'
import { memo } from 'react'

const LoadingText = 'Loading...'.split('')

function LoadingFallbackNoMemo() {
	return (
		<main className="flex flex-col gap-y-4 justify-center items-center h-screen">
			<Heading as="h2" weight="bold" size="9" color="indigo" className="mr-2 !flex !flex-row !font-poppins">
				{LoadingText.map((letter, idx) => {
					return (
						<p className="animate-wiggle" key={idx} style={{ animationDelay: `${idx / LoadingText.length}s` }}>
							{letter}
						</p>
					)
				})}
			</Heading>
			<Text as="p" size="6" weight="medium" className="">
				Hold on! We&lsquo;re loading what you need.
			</Text>
		</main>
	)
}

export const LoadingFallback = memo(LoadingFallbackNoMemo)
