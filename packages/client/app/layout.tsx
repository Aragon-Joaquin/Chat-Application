import type { Metadata } from 'next'
import './globals.css'
import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'

import { Poppins } from 'next/font/google'
import { ErrorBoundary } from './_errors/errorBoundary'
import { GetErrorContext } from './_context/ErrorContext'

export const metadata: Metadata = {
	title: 'Chat Application',
	description: 'Chat with friends everywhere, anytime.'
}

const poppins = Poppins({
	weight: '600',
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-poppins'
})

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className={`${poppins.variable}`}>
			<body>
				<ErrorBoundary>
					<GetErrorContext>
						<Theme appearance="light" grayColor="mauve" panelBackground="translucent" hasBackground>
							{children}
						</Theme>
					</GetErrorContext>
				</ErrorBoundary>
			</body>
		</html>
	)
}
