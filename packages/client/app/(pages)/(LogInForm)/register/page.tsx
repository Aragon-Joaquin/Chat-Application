'use client'

import { Heading, Text } from '@radix-ui/themes'
import { FieldComponent, FieldSVGComponent } from '../_components/Field.component'

const USER_FIELDNAME = 'username' as const
const PASSWORD_FIELDNAME = 'password' as const
const PASSWORD_FIELDNAME_CLARIFICATION = 'passwordClarification' as const

export default function RegisterPage() {
	return (
		<>
			<div className="flex flex-col gap-2">
				<Heading as="h2" size="7" className="font-bold">
					Register
				</Heading>
				<Text size="3">Where everything begins.</Text>
			</div>

			<div className="flex flex-col gap-y-4">
				<FieldComponent fieldName={USER_FIELDNAME} labelName="Username" placeholder="What's your name?" />
				<FieldComponent
					fieldName={PASSWORD_FIELDNAME}
					labelName="Password"
					placeholder="Enter your password"
					type="password"
				/>
				<FieldSVGComponent
					fieldName={PASSWORD_FIELDNAME_CLARIFICATION}
					labelName="Password again."
					placeholder="Enter your password again..."
					type="password"
				/>
			</div>
		</>
	)
}
