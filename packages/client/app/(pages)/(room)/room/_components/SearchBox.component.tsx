import { Root, Slot } from '@radix-ui/themes/components/text-field'
import { memo } from 'react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

function SearchBoxNoMemo({ placeholder }: { placeholder: string }) {
	return (
		<Root size="3" placeholder={placeholder} variant="surface" radius="large">
			<Slot>
				<MagnifyingGlassIcon />
			</Slot>
		</Root>
	)
}

export const SearchBox = memo(SearchBoxNoMemo)
