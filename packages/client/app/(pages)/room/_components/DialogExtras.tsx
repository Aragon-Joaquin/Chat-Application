import { SimpleForm } from '@/app/_components/SimpleForm.component'

export function SearchRooms() {
	return (
		<SimpleForm
			httpReq={{ rootRoute: '/room', subroute: '/', HTTPmethod: 'GET', passJWT: true }}
			arrayOfFields={[
				{ fieldName: 'roomName', labelName: 'Room Code', inputType: 'text' },
				{ fieldName: 'roomPassword', labelName: 'Password', inputType: 'password' }
			]}
		/>
	)
}
