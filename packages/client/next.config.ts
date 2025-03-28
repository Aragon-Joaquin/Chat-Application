import { PUBLIC_FOLDER_NAME } from '@chat-app/utils/globalConstants'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
				pathname: `${PUBLIC_FOLDER_NAME}**`
			}
		]
	}
}

export default nextConfig
