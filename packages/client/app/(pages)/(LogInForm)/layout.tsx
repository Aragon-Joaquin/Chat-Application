'use client'
import { ReactNode } from 'react'
import './login.css'
import { GetFieldContext } from './_context/FieldContext'

export default function LogInFormLayout({ children }: { children: ReactNode }) {
	return (
		<GetFieldContext>
			<main className="flex h-screen items-center justify-center px-10">{children}</main>
		</GetFieldContext>
	)
}
