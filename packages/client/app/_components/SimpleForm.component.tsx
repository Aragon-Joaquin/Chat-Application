import { Root, Field, Label, Control, Message, Submit } from '@radix-ui/react-form'
import { FormEvent, HTMLInputTypeAttribute, useId, useState } from 'react'
import { getAllFormsData, getFieldsFromInputs, FDResultsToObject } from '../_utils/FormData'

import { useRoomContext } from '../(pages)/(room)/room/_hooks/consumeRoomContext'
import { WS_ACTIONS } from '@chat-app/utils/globalConstants'
import { useConsumeContext } from '../_hooks/consumeContext'
import { BadRequest, BadRequestCodes } from '../_errors'

interface SimpleFormProps {
	fieldName: string
	labelName: string
	inputType: HTMLInputTypeAttribute
	requiredField?: boolean
}

type makeCallProps = (typeof WS_ACTIONS)[keyof typeof WS_ACTIONS]

export function SimpleForm({ arrayOfFields, makeCall }: { arrayOfFields: SimpleFormProps[]; makeCall: makeCallProps }) {
	const [isPending, setIsPending] = useState<boolean>(false)
	const {
		webSocket: { handleWSActions }
	} = useRoomContext()

	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		setIsPending(true)
		e.preventDefault()
		try {
			const formData = getAllFormsData({
				fields: getFieldsFromInputs(e),
				currentTargets: e?.currentTarget,
				acceptNulls: true
			})

			if (!formData)
				return setUIError(new BadRequest("There's no values to extract from the fields.", BadRequestCodes.BAD_REQUEST))

			const payloadObject = FDResultsToObject(
				formData,
				arrayOfFields.map((field) => field.fieldName)
			)

			//@ts-expect-error: i wont be fixing the dynamic types of this
			handleWSActions({ action: makeCall, payload: payloadObject })
		} finally {
			setIsPending(false)
		}
	}

	return (
		<Root onSubmit={(e) => handleSubmit(e)} className="w-4/5 flex flex-col justify-center items-center gap-y-4">
			{arrayOfFields.length > 0 &&
				arrayOfFields.map((props) => {
					return <FormMaker key={props.fieldName} fieldProps={props} />
				})}
			<Submit type="submit" className="submitButton" disabled={isPending}>
				Submit
			</Submit>
		</Root>
	)
}

function FormMaker({ fieldProps }: { fieldProps: SimpleFormProps }) {
	const { fieldName, labelName, inputType, requiredField } = fieldProps

	const htmlID = useId()
	return (
		<Field name={fieldName} className="w-full">
			<div className="flex flex-row justify-between mb-1">
				<Label htmlFor={htmlID} className="font-semibold text-sm -ml-2">
					{labelName}
				</Label>
				<Message match="valueMissing" className="errorMessage">
					{fieldName} is empty
				</Message>
			</div>
			<Control
				id={htmlID}
				type={inputType}
				autoComplete="off"
				className="controlField"
				{...(requiredField && { required: true })}
			/>
		</Field>
	)
}

// SVGField - add inputs type password
