import { UserTextDecorator } from '../decorators/userDecorator';

export class UserDto {
  @UserTextDecorator()
  userName: string;

  @UserTextDecorator(8, 50)
  userPassword: string;

  // profilePicture: string;
}
