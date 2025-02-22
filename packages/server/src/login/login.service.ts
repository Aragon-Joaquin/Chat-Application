import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from 'src/entities';
import { FindOneOptions, Repository } from 'typeorm';
import { UserInformation } from './dto/user.dto';
import { hashPassword } from 'src/utils/hashingFuncs';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(users)
    private userRepository: Repository<users>,
  ) {}

  async RegisterUser(body: UserInformation): Promise<UserInformation> {
    const { userName, userPassword } = body;
    const isDuped = await this.userRepository.findOne({
      where: {
        user_name: userName,
      },
    });

    if (isDuped)
      throw new HttpException('UserName is already taken', HttpStatus.CONFLICT);

    await this.userRepository.insert({
      user_name: userName,
      user_password: await hashPassword(userPassword),
      profile_picture: null,
    });

    return body;
  }

  async FindOne(whereObject: FindOneOptions<users>): Promise<users> {
    const user = await this.userRepository.findOne(whereObject);
    if (!user) {
      throw new HttpException(
        `There isn't any user with that name identifier.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
