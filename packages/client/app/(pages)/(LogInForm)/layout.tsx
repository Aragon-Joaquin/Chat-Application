'use client'
import { BadRequest } from '@/app/_errors'
import { useCallServer } from '@/app/_hooks/useCallServer'
import { FDNoNulls } from '@/app/_utils/FormData'
import { Root, Submit } from '@radix-ui/react-form'
import { FormEvent, ReactNode, useEffect } from 'react'
import { BottomText } from './_components/BottomText.component'
import { usePathname } from 'next/navigation'
import { getRouteProperties } from './constants'

//todo: create useActionState eventually
export default function LogInFormLayout({ children }: { children: ReactNode }) {
	const { makeHTTPRequest, responseData, isPending } = useCallServer()
	const path = getRouteProperties(usePathname())

	async function submitCredentials(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		//! temporal solution
		const fieldsFromInputs = Array.from(e?.currentTarget)
			.map((value) => {
				return value.getAttribute('name') ?? ''
			})
			.filter((value) => value)

		const formData = FDNoNulls({ fields: fieldsFromInputs, currentTargets: e?.currentTarget })
		if (formData == null) throw new BadRequest('Fields remain empty', 400)
		//save jwt
		makeHTTPRequest({
			rootRoute: '/login',
			subroute: '/',
			HTTPmethod: 'POST',
			bodyFields: formData
		})
	}

	useEffect(() => {
		console.log({ responseData })
	}, [responseData])
	return (
		<main className="flex h-screen items-center justify-center px-10">
			<Root
				className={`border-2 border-transparent/10 shadow-inner rounded-md rounded-t-none p-10 bg-neutral-100 flex flex-col gap-y-7 relative
					before:content-[""] before:w-full before:h-2 before:absolute before:bg-red-500 before:inset-0 before:-translate-y-full
					before:rounded-t-md before:border-2 before:border-transparent/10 before: ${path?.colorBG}`}
				onSubmit={(e) => submitCredentials(e)}
			>
				{children}

				<Submit
					type="submit"
					className={`w-full px-4 py-2 rounded-md bg-zinc-900 text-white ${isPending && 'bg-zinc-900/80'} transition-colors`}
					disabled={isPending}
				>
					{!isPending ? 'Login' : 'Loading... (making a animation later)'}
				</Submit>
				<div className="flex flex-col gap-y-2 justify-center w-full text-center">
					<BottomText descriptionText={path?.accDesc} linkTo={path?.accLink ?? '/'} boldText={path?.accBold} />
					<BottomText descriptionText="Forgot your password?" linkTo="/recoverPassword" boldText="Reset password" />
				</div>
			</Root>
		</main>
	)
}
