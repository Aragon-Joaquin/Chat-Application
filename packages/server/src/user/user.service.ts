import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Multer } from 'multer';
import { file_storage, users } from 'src/entities';
import { JWT_DECODED_INFO } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(users)
    private userRepository: Repository<users>,
    @InjectRepository(file_storage)
    private fileRepository: Repository<file_storage>,
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

  async uploadProfilePic(
    userID: JWT_DECODED_INFO['id'],
    file: Express.Multer.File,
  ) {
    const image = await this.fileRepository.insert({
      file_name: file.originalname,
      file_src: file.filename,
    });

    console.log({ image: image.raw[0].file_id });
    return await this.userRepository.update(
      { user_id: userID },
      {
        profile_picture: image.raw[0].file_id,
      },
    );
  }
}
