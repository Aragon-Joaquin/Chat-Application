import { Root, Field, Label, Control, Message, Submit } from '@radix-ui/react-form'
import { FormEvent, HTMLInputTypeAttribute, useId } from 'react'
import { useCallServer } from '../_hooks/useCallServer'
import { callServer } from '../_utils/callServer'
import { getAllFormsData, getFieldsFromInputs } from '../_utils/FormData'

interface SimpleFormProps {
	fieldName: string
	labelName: string
	inputType: HTMLInputTypeAttribute
	requiredField?: boolean
}

export function SimpleForm({
	arrayOfFields,
	httpReq
}: {
	arrayOfFields: SimpleFormProps[]
	httpReq: Parameters<typeof callServer>[0]
}) {
	const { makeHTTPRequest, isPending } = useCallServer()

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = getAllFormsData({
			fields: getFieldsFromInputs(e),
			currentTargets: e?.currentTarget,
			acceptNulls: true
		})

		makeHTTPRequest({ ...httpReq, bodyFields: formData ?? [] })
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
