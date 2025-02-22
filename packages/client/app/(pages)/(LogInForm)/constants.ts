export const HASHMAP_LOGINFORM = {
	'/login': {
		colorBG: 'before:bg-blue-500',
		accDesc: "Don't have an account yet?",
		accBold: 'Register now',
		accLink: '/register'
	},
	'/register': {
		colorBG: 'before:bg-red-500',
		accDesc: 'Already have an account?',
		accBold: 'Login now',
		accLink: '/login'
	}
}

export const getRouteProperties = (path: string) => HASHMAP_LOGINFORM[path as keyof typeof HASHMAP_LOGINFORM]
