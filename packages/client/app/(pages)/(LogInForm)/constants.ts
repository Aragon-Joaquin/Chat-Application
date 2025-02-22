import { callServer } from '@/app/_utils/callServer'

interface hashMap_LogIn {
	[key: string]: {
		colorBG: string
		accDesc: string
		accBold: string
		accLink: string
		reqInfo: Omit<Parameters<typeof callServer>[0], 'bodyFields' | 'passJWT'>
	}
}

export const HASHMAP_LOGINFORM: hashMap_LogIn = {
	'/login': {
		colorBG: 'before:bg-blue-500',
		accDesc: "Don't have an account yet?",
		accBold: 'Register now',
		accLink: '/register',
		reqInfo: {
			rootRoute: '/login',
			subroute: '/',
			HTTPmethod: 'POST'
		}
	},
	'/register': {
		colorBG: 'before:bg-red-500',
		accDesc: 'Already have an account?',
		accBold: 'Login now',
		accLink: '/login',
		reqInfo: {
			rootRoute: '/login',
			subroute: '/register',
			HTTPmethod: 'POST'
		}
	}
}

export const getRouteProperties = (path: string) => HASHMAP_LOGINFORM[path as keyof typeof HASHMAP_LOGINFORM]
