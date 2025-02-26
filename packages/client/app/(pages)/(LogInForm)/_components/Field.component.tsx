import { Control, Field } from '@radix-ui/react-form'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { memo, RefObject, useId } from 'react'
import { FieldHeader } from './inputSection/FieldHeader.component'
import { useFieldContext } from '../_hooks/useFieldContext'

interface FieldComponentProps {
	fieldName: string
	labelName: string
	placeholder: string
	type?: 'text' | 'password'
	ref?: RefObject<HTMLInputElement> | RefObject<null>
	compare?: boolean
	errorFieldName?: string
}

function FieldSVGComponentFunc({
	fieldName,
	labelName,
	placeholder,
	type = 'password',
	ref,
	errorFieldName
}: FieldComponentProps) {
	const htmlID = useId()
	const { view } = useFieldContext()

	return (
		<Field name={fieldName} className="flex flex-col">
			<FieldHeader labelName={labelName} htmlID={htmlID} errorFieldName={errorFieldName} />
			<div className="relative">
				<Control
					ref={ref}
					placeholder={placeholder}
					required
					type={view ? 'text' : type}
					id={htmlID}
					className="controlField pr-10"
					autoComplete={'off'}
				/>

				<SVGEye />
			</div>
		</Field>
	)
}

export const FieldSVGComponent = memo(FieldSVGComponentFunc)

export function SVGEye() {
	const { view, resetViewState } = useFieldContext()
	return (
		<>
			{view ? (
				<EyeOpenIcon color="black" className="SVGField" onClick={() => resetViewState((prevState) => !prevState)} />
			) : (
				<EyeClosedIcon color="black" className="SVGField" onClick={() => resetViewState((prevState) => !prevState)} />
			)}
		</>
	)
}
