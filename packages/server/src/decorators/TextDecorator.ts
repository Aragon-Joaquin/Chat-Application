import { applyDecorators } from '@nestjs/common';
import { IsString, MinLength, MaxLength } from 'class-validator';

export const TextMinMaxDecorator = (min: number = 3, max: number = 20) => {
  return applyDecorators(IsString(), MinLength(min), MaxLength(max));
};
