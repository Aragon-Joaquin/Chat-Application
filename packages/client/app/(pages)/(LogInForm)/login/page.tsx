'use client'

import { Heading, Text } from '@radix-ui/themes'
import { FieldComponent, FieldSVGComponent } from '../_components/Field.component'

const USER_FIELDNAME = 'username' as const
const PASSWORD_FIELDNAME = 'password' as const

export default function Login() {
	return (
		<>
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
		</>
	)
}
