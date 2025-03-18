import type { Config } from 'tailwindcss'
type fileAccepted = '.jpg' | '.png' | '.webp' | '.ico'

const getImage = (filename: string, filetype: fileAccepted) => `url('../public/images/${filename}${filetype}')`

export default {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)'
			},
			textColor: {
				descriptionColor: '#797979'
			},
			fontFamily: {
				poppins: ['var(--font-poppins)']
			},
			backgroundImage: {
				chatBackground: getImage('chat_bg', '.png')
			},
			keyframes: {
				wiggle_keyframes: {
					'0%': { transform: 'translateY(-10%);' },
					'100%': { transform: 'translateY(10%);' }
				}
			},
			animation: {
				wiggle: 'wiggle_keyframes 1s ease-in-out alternate infinite'
			}
		}
	},
	plugins: []
} satisfies Config
