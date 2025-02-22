import { Control, Field } from '@radix-ui/react-form'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { memo, useId, useState } from 'react'
import { FieldHeader } from './inputSection/FieldHeader.component'

interface FieldComponentProps {
	fieldName: string
	labelName: string
	placeholder: string
	type?: 'text' | 'password'
}

function FieldComponentFunc({ fieldName, labelName, placeholder, type = 'text' }: FieldComponentProps) {
	const htmlID = useId()

	return (
		<Field name={fieldName} className="flex flex-col">
			<FieldHeader labelName={labelName} htmlID={htmlID} />
			<Control
				placeholder={placeholder}
				required
				type={type}
				id={htmlID}
				className="p-2 rounded-md border-2 border-transparent/20 shadow-inner bg-neutral-100 w-full"
			/>
		</Field>
	)
}

export const FieldComponent = memo(FieldComponentFunc)

function FieldSVGComponentFunc({ fieldName, labelName, placeholder, type = 'password' }: FieldComponentProps) {
	const htmlID = useId()
	const [view, setView] = useState<boolean>(false)
	return (
		<Field name={fieldName} className="flex flex-col">
			<FieldHeader labelName={labelName} htmlID={htmlID} />
			<div className="relative">
				<Control
					placeholder={placeholder}
					required
					type={view ? 'text' : type}
					id={htmlID}
					className="p-2 rounded-md border-2 border-transparent/20 shadow-inner bg-neutral-100 w-full pr-10 font-normal"
				/>
				{view ? (
					//! TODO: fix this boilerplate
					<EyeOpenIcon
						color="black"
						className="w-5 h-5 transition-all hover:scale-110 cursor-pointer absolute right-0 top-0.5 -translate-x-1/2 translate-y-1/2"
						onClick={() => setView((prevState) => !prevState)}
					/>
				) : (
					<EyeClosedIcon
						color="black"
						className="w-5 h-5 transition-all hover:scale-110 cursor-pointer absolute right-0 top-0.5 -translate-x-1/2 translate-y-1/2"
						onClick={() => setView((prevState) => !prevState)}
					/>
				)}
			</div>
		</Field>
	)
}

export const FieldSVGComponent = memo(FieldSVGComponentFunc)
