import { Label, Message } from '@radix-ui/react-form'
import { useFieldContext } from '../../_hooks/useFieldContext'

interface FieldProps {
	labelName: string
	htmlID: string
	errorFieldName?: string
}

export function FieldHeader({ labelName, htmlID, errorFieldName }: FieldProps) {
	return (
		<div className="flex flex-row justify-between">
			<Label htmlFor={htmlID} className="font-semibold">
				{labelName}*
			</Label>
			<Message match={'valueMissing'} className="errorMessage">
				{errorFieldName ?? labelName} is empty
			</Message>
		</div>
	)
}

export function FieldHeaderCompare({ labelName, htmlID, errorFieldName }: FieldProps) {
	const { stateToCompare } = useFieldContext()
	return (
		<div className="flex flex-row justify-between">
			<Label htmlFor={htmlID} className="font-semibold">
				{labelName}*
			</Label>
			<Message match={'valueMissing'} className="errorMessage">
				{errorFieldName ?? labelName} is empty
			</Message>
			<Message match={'typeMismatch'} forceMatch={stateToCompare} className="errorMessage">
				{"Passwords don't match"}
			</Message>
		</div>
	)
}
