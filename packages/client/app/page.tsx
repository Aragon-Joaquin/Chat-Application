'use server'

import { redirect } from 'next/navigation'
import { getJWT } from './_utils/JWTMethods'

export default async function Home() {
	const JWTInfo = await getJWT()
	if (!JWTInfo) redirect('/login')
	redirect('/room')
}
