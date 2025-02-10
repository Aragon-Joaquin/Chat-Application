export default function LayoutDynamicRoom({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<>
			<aside>Left chats</aside>
			<div>{children}</div>
		</>
	)
}
