import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      const userFound = await this.userRepository.query(`
        SELECT u.user_name, f.file_src FROM USERS u LEFT JOIN file_storage f ON u.profile_picture = f.file_id
        WHERE user_id = ${userID}::integer;`);

      if (userFound == undefined)
        throw new BadRequestException('This user does not exists.');

      return userFound?.at(0);
    } catch {
      return null;
    }
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
