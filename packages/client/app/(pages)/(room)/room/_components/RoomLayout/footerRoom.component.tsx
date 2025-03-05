import { ImageIcon, PaperPlaneIcon } from '@radix-ui/react-icons'

export function FooterRoom() {
	return (
		<footer className="flex flex-row justify-center gap-x-2 bg-neutral-100 border-t-[1px] border-transparent/10 bottom-0 w-full h-16 items-center">
			<div className="h-full flex items-center">
				<ImageIcon height={0} width={0} className="w-auto h-3/5 svgOnHover" />
			</div>
			<div className="flex flex-row w-1/2 h-full items-center relative">
				<input
					type="text"
					placeholder="Start typing what you wanna say here!"
					autoComplete="off"
					className="pl-4 pr-10 font-normal py-2 rounded-lg w-full border-2 border-transparent/10 focus:!outline-blue-300 focus:!bg-blue-200/20"
				/>
				<PaperPlaneIcon
					height={0}
					width={0}
					className="w-auto h-3/5 absolute bottom-0 right-2 -translate-y-1/3 svgOnHover"
				/>
			</div>
		</footer>
	)
}
