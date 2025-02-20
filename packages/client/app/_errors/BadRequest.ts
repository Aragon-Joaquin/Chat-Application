export class BadRequest extends Error {
	public errorCode: number

	constructor(message: string, errorCode: number) {
		super()
		this.name = 'Bad Request'
		this.message = message ?? 'Message not provided.'
		this.errorCode = errorCode ?? 0
		this.cause = ''
		this.stack = ''
	}
}
