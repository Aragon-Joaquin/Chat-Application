'use client'

import { ImageAndFallback } from '@/app/_components/ImageAndFallback.component'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { USER_TYPES_RESPONSES } from '@/app/_utils/bodyRequests'
import { GETSessionStorage } from '@/app/_utils/sessionStorage'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { Button, Dialog, Heading, IconButton, Text } from '@radix-ui/themes'
import { ChangeEvent, DragEvent, memo, useEffect, useId, useRef, useState } from 'react'

function ProfileInformationNoMemo() {
	//! i didnt want to do this, but it crashes if i dont
	const [sessionStorage, setSessionStorage] = useState<ReturnType<typeof GETSessionStorage>>()
	useEffect(() => {
		setSessionStorage(GETSessionStorage())
	}, [])

	if (sessionStorage == null) return

	return (
		<footer className="flex flex-row items-center pb-5 gap-x-2 bg-neutral-100 borderLayout w-full !max-w-[350px]">
			<div className="h-14 w-14 min-h-14 min-w-14 rounded-[50%]">
				<ImageAndFallback picture={sessionStorage.profile_picture ?? ''} altName="Your profile picture." />
			</div>

			<span className="flex flex-col !overflow-hidden w-full">
				<span className="flex flex-row items-center gap-x-1 w-full">
					<Heading as="h4" size="4" className="!overflow-hidden !text-nowrap !text-ellipsis max-w-[90%]" title="You">
						{sessionStorage.user_name ?? 'You'}
					</Heading>

					<DialogEditProfile />
				</span>

				<Text as="p" weight="regular" size="3" wrap="pretty" className="!text-descriptionColor">
					Your profile.
				</Text>
			</span>
		</footer>
	)
}

export const ProfileInformation = memo(ProfileInformationNoMemo)

//! dialog, only used in this file ⬇

const DialogEditProfile = function DialogEditProfileNoMemo() {
	const { responseData, makeHTTPRequest } = useCallServer<USER_TYPES_RESPONSES['/uploadPhoto']>()
	const divRef = useRef<HTMLDivElement>(null)
	const idInput = useId()
	const [image, setImage] = useState<File | null>(null)

	function handleDrop(e: DragEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>) {
		e.preventDefault()

		const file = 'dataTransfer' in e ? e.dataTransfer?.files : e?.target?.files

		if (!file?.length || !divRef?.current == undefined) return
		const getFile = file[0]

		setImage(getFile)
		try {
			const fileReader = new FileReader()
			fileReader.onload = (e) => {
				divRef!.current!.style.backgroundImage = `url(${e.target?.result})`
			}
			fileReader.readAsDataURL(getFile)
		} catch {
			return
		}
	}
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

				<form encType="multipart/form-data" className="flex flex-col gap-y-4 justify-center items-center">
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

					<span>
						<Text
							as="label"
							htmlFor={idInput}
							className="bg-neutral-300 font-medium px-4 py-2 rounded-md hover:scale-110 hover:cursor-pointer hover:brightness-105"
						>
							Or select image here!
						</Text>
						<input id={idInput} type="file" accept="image/*" hidden multiple={false} onChange={(e) => handleDrop(e)} />
					</span>
				</form>

				<div className="flex flex-row justify-end gap-x-2 mt-4">
					<Dialog.Close>
						<Button variant="soft" color="gray" className="hover:!cursor-pointer">
							Cancel
						</Button>
					</Dialog.Close>
					<Dialog.Close>
						<Button className="hover:!cursor-pointer">Save</Button>
					</Dialog.Close>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	)
}
