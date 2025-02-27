import { Root, Trigger, Portal, Overlay, Content, Title, Description, Close } from '@radix-ui/react-dialog'
import { Cross1Icon } from '@radix-ui/react-icons'
import { memo, ReactNode } from 'react'

interface DialogProps {
	trigger: ReactNode
	title: string
	description?: string
	mainComponent: ReactNode
}

function DialogComponent({ trigger, title, description, mainComponent }: DialogProps) {
	return (
		<Root>
			<Trigger asChild>{trigger}</Trigger>
			<Portal>
				<Overlay className="fixed bg-black/20 w-screen h-screen inset-0 z-10" />
				<Content className="flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md z-20 bg-slate-200 ">
					<Title>{title}</Title>
					{description != null && <Description>{description}</Description>}
					{mainComponent}
					<Close>
						<Cross1Icon />
					</Close>
				</Content>
			</Portal>
		</Root>
	)
}

export const CustomDialog = memo(DialogComponent)
