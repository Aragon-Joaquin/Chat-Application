import { UserTextDecorator } from '../decorators/userDecorator';

export interface UserInformation {
  userName: string;
  userPassword: string;
}

export interface UserInDB extends UserInformation {
  id: number;
  profilePicture: string;
}

export class UserDto implements UserInformation {
  @UserTextDecorator()
  userName: string;

  @UserTextDecorator(8, 50)
  userPassword: string;
}
