import { UserInfo } from './tableTypes'

const DEFAULT_KEY = 'userInformation' as const

export const SETSessionStorage = (user: UserInfo) => {
	if (typeof 'window' === undefined) return null
	sessionStorage.setItem(DEFAULT_KEY, JSON.stringify(user))
}

export const GETSessionStorage = (key?: 'string') => {
	if (typeof 'window' === undefined) return null
	const storage = sessionStorage?.getItem(key ?? DEFAULT_KEY)
	if (storage == undefined) return null

	return JSON.parse(storage) as Partial<Omit<UserInfo, 'user_id'>>
}

// export const DELETESessionStorage = (key?: 'string') => {

// }
