import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from 'src/entities';
import { Repository } from 'typeorm';
import { UserInformation } from './dto/user.dto';
import { hashPassword } from 'src/utils/hashingFuncs';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(users)
    private userRepository: Repository<users>,
  ) {}

  async findOneUser(): Promise<users[]> {
    return await this.userRepository.find();
  }

  async registerUser(body: UserInformation): Promise<undefined> {
    const { userName, userPassword } = body;
    const isDuped = await this.userRepository.findOne({
      where: {
        user_name: userName,
      },
    });

    if (isDuped)
      throw new HttpException('UserName is already taken', HttpStatus.CONFLICT);

    // finish this
    await this.userRepository.create({
      user_name: userName,
      user_password: await hashPassword(userPassword),
    });
  }
}
