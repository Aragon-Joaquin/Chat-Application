'use client'

import { Root, Submit } from '@radix-ui/react-form'
import { Heading, Text } from '@radix-ui/themes'
import { FormEvent } from 'react'
import { FieldComponent, FieldSVGComponent } from './_components/Field.component'
import { BottomText } from './_components/BottomText.component'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { BadRequest } from '@/app/_errors'
import { FDNoNulls } from '@/app/_utils/FormData'

const USER_FIELDNAME = 'username' as const
const PASSWORD_FIELDNAME = 'password' as const

export default function Login() {
	const { makeHTTPRequest, isPending } = useCallServer()

	async function submitCredentials(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = FDNoNulls({ fields: [USER_FIELDNAME, PASSWORD_FIELDNAME], currentTargets: e?.currentTarget })

		if (formData == null) throw new BadRequest('Fields remain empty', 400)

		//save jwt
		const result = makeHTTPRequest({
			rootRoute: '/login',
			subroute: '/',
			HTTPmethod: 'POST',
			bodyFields: formData
		})

		console.log({ result })
	}

	return (
		<main className="flex h-screen items-center justify-center px-10">
			{/* Root element causes a rerender on every keystroke */}
			<Root
				onSubmit={(e) => submitCredentials(e)}
				className="border-2 border-transparent/10 shadow-inner rounded-md p-10 bg-neutral-100 flex flex-col gap-y-10"
			>
				<div className="flex flex-col gap-2">
					<Heading as="h2" size="7" className="font-bold">
						Login
					</Heading>
					<Text size="3">Login to your account to access your chats.</Text>
				</div>

				<div className="flex flex-col gap-y-4">
					<FieldComponent fieldName={USER_FIELDNAME} labelName="Username" placeholder="What's your username?" />
					<FieldSVGComponent
						fieldName={PASSWORD_FIELDNAME}
						labelName="Password"
						placeholder="Enter your password..."
						type="password"
					/>
				</div>

				<Submit type="submit" className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white">
					{!isPending ? 'Login' : 'Loading... (making a animation later)'}
				</Submit>
				<div className="flex flex-col gap-y-2 justify-center w-full text-center">
					<BottomText descriptionText="Don't have an account?" linkTo="/register" boldText="Register now." />
					<BottomText descriptionText="Forgot your password?" linkTo="/recoverPassword" boldText="Reset password" />
				</div>
			</Root>
		</main>
	)
}
