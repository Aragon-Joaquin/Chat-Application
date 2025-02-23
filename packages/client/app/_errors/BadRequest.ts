export const BadRequestCodes = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	METHOD_NOT_ALLOWED: 405,
	CONTENT_TOO_LARGE: 413,
	UNSUPPORTED_MEDIA_TYPE: 415,
	TOO_MANY_REQUESTS: 429
}

export type BadRequestType = (typeof BadRequestCodes)[keyof typeof BadRequestCodes]

export class BadRequest extends Error {
	public errorCode: BadRequestType

	constructor(message: string, errorCode: BadRequestType) {
		super()
		this.name = 'Bad Request'
		this.message = message ?? 'Message not provided.'
		this.errorCode = errorCode ?? 0
		this.cause = ''
		this.stack = ''
	}
}
