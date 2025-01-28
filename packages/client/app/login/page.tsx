'use client'

import { Root, Submit } from '@radix-ui/react-form'
import { Heading, Text } from '@radix-ui/themes'
import { FormEvent } from 'react'
import { FieldComponent, FieldSVGComponent } from './_components/Field.component'
import { BottomText } from './_components/BottomText.component'

function submitCredentials(e: FormEvent<HTMLFormElement>) {
	e.preventDefault()
	console.log('submit', e)
	//new FormData
}

export default function Login() {
	return (
		<main className="flex h-screen items-center justify-center px-10">
			<Root
				onSubmit={(e) => submitCredentials(e)}
				className="border-2 border-transparent/5 shadow-inner rounded-md p-10 bg-neutral-100 flex flex-col gap-y-10"
			>
				<div className="flex flex-col gap-2">
					<Heading as="h2" size="7" className="font-bold">
						Login
					</Heading>
					<Text size="3">Login to your account to access your chats.</Text>
				</div>

				<div className="flex flex-col gap-y-4">
					<FieldComponent fieldName="username" labelName="Username" placeholder="What's your username?" />
					<FieldSVGComponent
						fieldName="password"
						labelName="Password"
						placeholder="Enter your password..."
						type="password"
					/>
				</div>

				<Submit type="submit" className="w-full px-4 py-2 rounded-md bg-zinc-900 text-white">
					Login
				</Submit>
				<div className="flex flex-col gap-y-2 justify-center w-full text-center">
					<BottomText descriptionText="Don't have an account?" linkTo="/register" boldText="Register now." />
					<BottomText descriptionText="Forgot your password?" linkTo="/recoverPassword" boldText="Reset password" />
				</div>
			</Root>
		</main>
	)
}
