import { Slot } from '@radix-ui/themes/components/text-field'
import { memo } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { TextField } from '@radix-ui/themes'

function SearchBoxNoMemo({ placeholder }: { placeholder: string }) {
	return (
		<section className="bg-slate-200 p-2">
			<TextField.Root size="3" placeholder={placeholder} variant="surface" radius="large">
				<Slot>
					<MagnifyingGlassIcon />
				</Slot>
			</TextField.Root>
		</section>
	)
}

export const SearchBox = memo(SearchBoxNoMemo)
