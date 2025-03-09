'use client'

import { Heading, Text } from '@radix-ui/themes'
import { FormEvent, useId } from 'react'
import { useSubmitCredentials } from '../_hooks/submitCredentials'
import { Control, Field, Root, Submit } from '@radix-ui/react-form'
import { BottomText } from '../_components/BottomText.component'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { FieldHeader, FieldHeaderCompare } from '../_components/inputSection/FieldHeader.component'
import { useFieldContext } from '../_hooks/useFieldContext'
import { SVGEye } from '../_components/Field.component'

const USER_FIELDNAME = 'userName' as const
const PASSWORD_FIELDNAME = 'userPassword' as const
const PASSWORD_FIELDNAME_CLARIFICATION = 'passwordConfirm' as const

export default function RegisterPage() {
	const { submitCredentials } = useSubmitCredentials()
	const { isPending } = useCallServer()
	const { passwordField, pwdCompare, view, resetComparingState } = useFieldContext()

	const userName = useId()
	const passwordID = useId()
	const pwdCompId = useId()

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (passwordField.current?.value !== pwdCompare.current?.value) return resetComparingState(true)

		await submitCredentials(e, { rootRoute: '/login', subroute: '/register', HTTPmethod: 'POST' }, [
			USER_FIELDNAME,
			PASSWORD_FIELDNAME
		])
	}

	return (
		<Root className={`formLogin before:bg-red-500`} onSubmit={(e) => handleSubmit(e)}>
			<div>
				<Heading as="h2" size="7" className="font-bold">
					Register
				</Heading>
				<Text size="3">Where everything begins.</Text>
			</div>

			<div className="paddingFields">
				<Field name={USER_FIELDNAME} className="flex flex-col">
					<FieldHeader labelName="Username" htmlID={userName} />
					<Control placeholder="What's your name?" required type="text" id={userName} className="controlField" />
				</Field>

				<Field name={PASSWORD_FIELDNAME} className="flex flex-col">
					<FieldHeader labelName="Password" htmlID={passwordID} />
					<div className="relative">
						<Control
							ref={passwordField}
							placeholder="Enter your password"
							required
							type={view ? 'text' : 'password'}
							id={passwordID}
							autoComplete="off"
							className="controlField !pr-10"
						/>

						<SVGEye />
					</div>
				</Field>

				<Field name={PASSWORD_FIELDNAME_CLARIFICATION} className="flex flex-col">
					<FieldHeaderCompare labelName="Confirm Password" htmlID={pwdCompId} errorFieldName={'Passwords'} />

					<div className="relative">
						<Control
							ref={pwdCompare}
							placeholder="Enter your password again..."
							required
							type={view ? 'text' : 'password'}
							id={pwdCompId}
							className="controlField !pr-10"
							autoComplete="off"
							onChange={() => resetComparingState(false)}
						/>

						<SVGEye />
					</div>
				</Field>
			</div>

			<Submit type="submit" className={`submitButton ${isPending && 'bg-zinc-900/80'}`} disabled={isPending}>
				{!isPending ? 'Login' : 'Loading... (making a animation later)'}
			</Submit>
			<div className="footerForm">
				<BottomText descriptionText="Already have an account?" linkTo="/login" boldText="Login now" />
				<BottomText descriptionText="Forgot your password?" linkTo="/recoverPassword" boldText="Reset password" />
			</div>
		</Root>
	)
}
