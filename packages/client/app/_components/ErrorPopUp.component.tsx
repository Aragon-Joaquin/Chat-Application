import { Cross2Icon } from '@radix-ui/react-icons'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle } from '@radix-ui/react-toast'
import { Button } from '@radix-ui/themes'
import { memo } from 'react'

interface ErrorCode extends Error {
	errorCode: number
}

function PopUp({ error, onErrorClick }: { error: ErrorCode; onErrorClick: () => void }) {
	return (
		<ToastProvider swipeDirection="right">
			<Toast>
				<ToastTitle>
					{error.name ?? 'Unknown Error'} - {error.errorCode ?? 0}
				</ToastTitle>
				<ToastDescription>{error.message}</ToastDescription>

				<ToastClose asChild>
					<Button title="Close this" onClick={onErrorClick}>
						<Cross2Icon />
					</Button>
				</ToastClose>
			</Toast>
		</ToastProvider>
	)
}

export const ErrorPopUp = memo(PopUp)
