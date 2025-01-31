import { UserTextDecorator } from '../decorators/userDecorator';

export type UserInformation = {
  userName: string;
  userPassword: string;
  profilePicture: string;
};

export class UserDto implements UserInformation {
  @UserTextDecorator()
  userName: string;

  @UserTextDecorator(8, 50)
  userPassword: string;

  profilePicture: string;
}
