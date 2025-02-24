import { Cross2Icon, CrossCircledIcon } from '@radix-ui/react-icons'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@radix-ui/react-toast'
import { memo, useEffect, useState } from 'react'

interface ErrorCode extends Omit<Error, 'message'> {
	message: string | string[]
	errorCode: number
}

//! finish this
function PopUp({ error, onErrorClick }: { error: ErrorCode | Error; onErrorClick: (close: null) => void }) {
	const [openToast, setOpenToast] = useState<boolean>(false)

	useEffect(() => {
		setOpenToast(true)
	}, [error])

	return (
		<ToastProvider swipeDirection="right">
			<Toast
				open={openToast}
				onOpenChange={setOpenToast}
				className="relative border-2 border-neutral-950/20 p-2 rounded-md rounded-l-none shadow-xl grid grid-cols-[225px_auto] auto-rows-auto *:h-full
				before:content-[''] before:h-[calc(100%_+_4px)] before:w-5 before:bg-red-500 before:absolute before:-translate-x-full before:rounded-l-md before:border-2 before:border-red-800/20 before:-translate-y-[2px]"
			>
				<ToastTitle className="flex flex-row items-center gap-x-1 col-span-1 row-span-1 select-text mb-1">
					<CrossCircledIcon className="h-5 w-max bg-red-500 rounded-full text-white" />
					<h3 className="text-lg font-semibold text-neutral-800/90 flex flex-row gap-x-2 items-center">
						{error.name ?? 'Unknown name'}
						<p className="text-neutral-600/70 text-sm">{'errorCode' in error ? error.errorCode : 0}</p>
					</h3>
				</ToastTitle>
				<ToastDescription className="col-span-full row-span-2 text-neutral-500 px-2 select-text text-sm overflow-y-auto h-full">
					{Array.isArray(error.message) ? <ErrorList values={error.message} /> : (error?.message ?? 'Unknown Error')}
				</ToastDescription>

				<ToastClose
					className="col-start-2 row-start-1 w-6 h-6 self-center place-self-center"
					onClick={() => onErrorClick(null)}
				>
					<Cross2Icon className="w-full h-full text-slate-600 hover:scale-125 transition-all" width={0} height={0} />
				</ToastClose>
			</Toast>
			<ToastViewport className="fixed right-0 bottom-0 z-50 min-h-28 max-h-72 w-80 mr-5 mb-5" />
		</ToastProvider>
	)
}

export const ErrorPopUp = memo(PopUp)

function ErrorList({ values }: { values: string[] }) {
	return (
		<div className="h-full">
			<h4 className="font-semibold">Oops! Some requirements are not okay.</h4>
			<ul className="list-disc list-inside">
				{values.map((errorName, idx) => {
					return <li key={idx}>{errorName}</li>
				})}
			</ul>
		</div>
	)
}
