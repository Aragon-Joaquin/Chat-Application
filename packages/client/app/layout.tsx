import type { Metadata } from 'next'
import './globals.css'
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'

export const metadata: Metadata = {
	title: 'Chat Application',
	description: 'Chat with friends everywhere and anytime.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<Theme appearance="light" grayColor="mauve" panelBackground="translucent" hasBackground>
					{children}
				</Theme>
			</body>
		</html>
	)
}
