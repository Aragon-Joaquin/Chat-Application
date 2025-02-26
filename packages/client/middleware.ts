import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getJWT } from './app/_utils/JWTMethods'

export default async function middlewareJWT(request: NextRequest) {
	const getAccessToken = await getJWT()
	if (!getAccessToken) return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
	matcher: ['/room', '/room/(.*)']
}
