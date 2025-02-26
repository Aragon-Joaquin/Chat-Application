'use server' //! <- component using this function needs to be server-sided
import { cookies } from 'next/headers'

const JWT_COOKIE_NAME = 'JWT_ONLYUSE' as const

export async function getJWT() {
	const AllCookies = await cookies()
	const gotCookie = AllCookies?.get(JWT_COOKIE_NAME)

	return gotCookie != null ? gotCookie?.toString() : null
}

export async function setJWT(returnedValue: string) {
	const AllCookies = await cookies()
	AllCookies.set(JWT_COOKIE_NAME, returnedValue, {
		httpOnly: true,
		sameSite: true,
		secure: true
		// maxAge
		// expires
	})
}
