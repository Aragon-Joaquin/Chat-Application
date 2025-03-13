import { HttpStatus } from '@nestjs/common';

export const createErrorMessage = (
  name: string,
  code: HttpStatus,
  content?: any,
) =>
  JSON.stringify({
    error_name: name ?? '',
    error_code: code ?? HttpStatus.AMBIGUOUS,
    ...(content != null && { error_content: content }),
  });
