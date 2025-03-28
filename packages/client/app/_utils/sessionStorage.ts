import { UserInfo } from './tableTypes'

const DEFAULT_KEY = 'userInformation' as const
type USER_STORAGE = { user_name: string; file_src: string }

export const SETSessionStorage = (user: UserInfo) => {
	if (typeof 'window' === undefined) return null
	sessionStorage.setItem(DEFAULT_KEY, JSON.stringify(user))
}

export const GETSessionStorage = (key?: 'string') => {
	if (typeof 'window' === undefined) return null
	const storage = sessionStorage?.getItem(key ?? DEFAULT_KEY)
	if (storage == undefined) return null

	return JSON.parse(storage) as USER_STORAGE
}

export const DELETESessionStorage = () => {
	if (typeof 'window' === undefined) return null
	try {
		sessionStorage.clear()
	} catch (e) {
		console.log(e)
	}
}
