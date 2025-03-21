import { BadRequest, BadRequestCodes } from '@/app/_errors'
import { useConsumeContext } from '@/app/_hooks/consumeContext'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { USER_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { Button, Dialog, IconButton, Text } from '@radix-ui/themes'
import { ChangeEvent, DragEvent, FormEvent, useCallback, useEffect, useId, useRef, useState } from 'react'

const INPUT_FILE_NAME = 'file' as const

export const DialogEditProfile = function DialogEditProfileNoMemo() {
	const { responseData, makeHTTPRequest } = useCallServer<USER_TYPES_RESPONSES['/uploadPhoto']>()
	const {
		ErrorContext: { setUIError }
	} = useConsumeContext()

	const divRef = useRef<HTMLDivElement>(null)
	const idInput = useId()
	const [image, setImage] = useState<File | null>(null)

	function handleDrop(e: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>) {
		e.preventDefault()

		const file = 'dataTransfer' in e ? e.dataTransfer?.files : e?.target?.files

		if (!file?.length || !divRef?.current == undefined) return
		const getFile = file[0]

		if (!['image/png', 'image/jpeg'].includes(getFile.type))
			return setUIError(new BadRequest('Needs to be a PNG/JPG/JPEG file', BadRequestCodes.UNSUPPORTED_MEDIA_TYPE))

		setImage(getFile)
		try {
			const fileReader = new FileReader()
			fileReader.onload = (e) => {
				divRef!.current!.style.backgroundImage = `url(${e.target?.result})`
			}
			fileReader.readAsDataURL(getFile)
		} catch {
			return setUIError(new BadRequest('Something happend while processing image', BadRequestCodes.BAD_REQUEST))
		}
	}

	const handleSubmit = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			console.log({ image })
			if (image == null) return setUIError(new BadRequest('Upload something first!', BadRequestCodes.BAD_REQUEST))
			const FData = new FormData()
			FData.append(INPUT_FILE_NAME, image)

			makeHTTPRequest({
				rootRoute: '/user',
				subroute: '/uploadPhoto',
				HTTPmethod: 'POST',
				passJWT: true,
				formData: FData
			})
		},
		[image, makeHTTPRequest, setUIError]
	)

	useEffect(() => {
		console.log({ responseData })
	}, [responseData])

	return (
		<Dialog.Root>
			<Dialog.Trigger>
				<IconButton variant="ghost" size="2" className="hover:cursor-pointer">
					<Pencil1Icon />
				</IconButton>
			</Dialog.Trigger>

			<Dialog.Content maxWidth="450px">
				<Dialog.Title className="!mb-1">Edit profile</Dialog.Title>
				<Dialog.Description className="!text-descriptionColor !mb-4">
					Change the way you express to others!
				</Dialog.Description>

				<form
					encType="multipart/form-data"
					className="flex flex-col gap-y-4 justify-center items-center"
					onSubmit={(e) => handleSubmit(e)}
				>
					<div
						style={{ backgroundImage: '' }}
						ref={divRef}
						className="w-52 h-52 border-2 border-dotted border-neutral-400 rounded-sm flex justify-center items-center bg-black/10 text-transparent/50 !bg-center !bg-contain !bg-no-repeat"
						onDrop={(e) => {
							handleDrop(e)
						}}
						onDragOver={(e) => {
							e.preventDefault()
							e.stopPropagation()
						}}
					>
						<Text as="label" weight="medium" className="!text-center">
							{image == null && 'Drop your image here!'}
						</Text>
					</div>

					<Text
						as="label"
						htmlFor={idInput}
						className="bg-neutral-300 font-medium px-4 py-2 rounded-md hover:scale-110 hover:cursor-pointer hover:brightness-105 transition-all"
					>
						Or select image here!
					</Text>
					<input
						id={idInput}
						name={INPUT_FILE_NAME}
						type="file"
						accept="image/*"
						hidden
						multiple={false}
						onChange={(e) => handleDrop(e)}
					/>

					<div className="flex flex-row justify-end gap-x-2 mt-4">
						<Dialog.Close>
							<Button variant="soft" color="gray" className="hover:!cursor-pointer">
								Cancel
							</Button>
						</Dialog.Close>
						<Dialog.Close>
							<Button className="hover:!cursor-pointer" type="submit">
								Save
							</Button>
						</Dialog.Close>
					</div>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	)
}
