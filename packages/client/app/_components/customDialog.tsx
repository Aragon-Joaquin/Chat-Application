import { Root, Trigger, Portal, Overlay, Content, Title, Description, Close } from '@radix-ui/react-dialog'
import { Cross1Icon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import { memo, ReactNode } from 'react'

interface DialogProps {
	iconName: ReactNode
	title: string
	description?: string
	mainComponent: ReactNode
}

function DialogComponent({ iconName, title, description, mainComponent }: DialogProps) {
	return (
		<Root>
			<Trigger asChild>
				<Button className="hover:cursor-pointer hover:scale-110 hover:transition-all">{iconName}</Button>
			</Trigger>
			<Portal>
				<Overlay className="fixed bg-black/20 w-screen h-screen inset-0 z-10" />
				<Content className="flex flex-col fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border-[1px] border-transparent/20 shadow-xl p-4 max-w-md z-20 bg-slate-100 ">
					<Title className="font-bold text-xl mb-2">{title}</Title>
					{description != null && <Description className="text-descriptionColor mb-4">{description}</Description>}
					<section className="flex items-center justify-center">{mainComponent}</section>
					<Close className="absolute right-0 -translate-x-1/2 hover:scale-110 transition-all bg-blue-600 px-3 py-2 rounded-md">
						<Cross1Icon className="w-4 h-4" color="white" width={0} height={0} />
					</Close>
				</Content>
			</Portal>
		</Root>
	)
}

export const CustomDialog = memo(DialogComponent)
