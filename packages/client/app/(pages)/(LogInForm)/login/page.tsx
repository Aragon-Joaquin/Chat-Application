'use client'

import { Heading, Text } from '@radix-ui/themes'
import { FieldSVGComponent } from '../_components/Field.component'
import { Control, Field, Root, Submit } from '@radix-ui/react-form'
import { BottomText } from '../_components/BottomText.component'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { FieldHeader } from '../_components/inputSection/FieldHeader.component'
import { FormEvent, useEffect, useId } from 'react'
import { useSubmitCredentials } from '../_hooks/submitCredentials'
import { permanentRedirect } from 'next/navigation'

const USER_FIELDNAME = 'username' as const
const PASSWORD_FIELDNAME = 'password' as const

export default function Login() {
	const { isPending } = useCallServer()
	const { submitCredentials, hasToken } = useSubmitCredentials()
	const htmlID = useId()

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (hasToken) return
		await submitCredentials(e, {
			rootRoute: '/login',
			subroute: '/',
			HTTPmethod: 'POST'
		})
	}
	useEffect(() => {
		if (hasToken) permanentRedirect('room')
	}, [hasToken])

	return (
		<Root className={`formLogin before:bg-blue-500`} onSubmit={(e) => handleSubmit(e)}>
			<div>
				<Heading as="h2" size="7" className="font-bold">
					Login
				</Heading>
				<Text size="3">Login to your account to access your chats.</Text>
			</div>

			<div className="paddingFields">
				<Field name={USER_FIELDNAME} className="flex flex-col">
					<FieldHeader labelName="Username" htmlID={htmlID} />
					<Control placeholder="What's your username?" required type="text" id={htmlID} className="controlField" />
				</Field>

				<FieldSVGComponent
					fieldName={PASSWORD_FIELDNAME}
					labelName="Password"
					placeholder="Enter your password..."
					type="password"
				/>
			</div>

			<Submit type="submit" className={`submitButton ${isPending && 'bg-zinc-900/80'}`} disabled={isPending}>
				{!isPending ? (hasToken ? 'You are already logged in!' : 'Login') : 'Loading... (making a animation later)'}
			</Submit>
			<div className="footerForm">
				<BottomText descriptionText="Don't have an account yet?" linkTo="/register" boldText="Register now" />
				<BottomText descriptionText="Forgot your password?" linkTo="/recoverPassword" boldText="Reset password" />
			</div>
		</Root>
	)
}
