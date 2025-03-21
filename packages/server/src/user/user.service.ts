import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { file_storage, users } from 'src/entities';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(users)
    private userRepository: Repository<users>,
  ) {}

  async getUser(userID: JWT_DECODED_INFO['id']) {
    const userFound = await this.userRepository.findOne({
      where: {
        user_id: userID,
      },
      select: {
        user_id: false,
        user_name: true,
        profile_picture: { file_src: true },
        user_password: false,
      },
    });

    if (userFound == undefined)
      throw new BadRequestException('This user does not exists.');

    return userFound;
  }
}
