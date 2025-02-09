import { TextMinMaxDecorator } from 'src/decorators';

export interface UserInformation {
  userName: string;
  userPassword: string;
}

export interface UserInDB extends UserInformation {
  id: number;
  profilePicture: string;
}

export class UserDto implements UserInformation {
  @TextMinMaxDecorator()
  userName: string;

  @TextMinMaxDecorator(8, 50)
  userPassword: string;
}
