import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { users } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(users)
    private userRepository: Repository<users>,
  ) {}

  findAll(): Promise<users[]> {
    return this.userRepository.find();
  }
}
