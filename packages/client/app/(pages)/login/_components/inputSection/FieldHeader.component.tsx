import { Label, Message } from '@radix-ui/react-form'

export function FieldHeader({ labelName, htmlID }: { labelName: string; htmlID: string }) {
	return (
		<div className="flex flex-row justify-between">
			<Label htmlFor={htmlID} className="font-semibold">
				{labelName}*
			</Label>
			<Message match={'valueMissing'} className="text-sm text-red-600 font-medium">
				{labelName} is required
			</Message>
		</div>
	)
}
