import type { Metadata } from 'next'
import './globals.css'
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'
import { GetErrorContext } from './_context/ErrorContext'

export const metadata: Metadata = {
	title: 'Chat Application',
	description: 'Chat with friends everywhere, anytime.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<GetErrorContext>
					<Theme appearance="light" grayColor="mauve" panelBackground="translucent" hasBackground>
						{children}
					</Theme>
				</GetErrorContext>
			</body>
		</html>
	)
}
