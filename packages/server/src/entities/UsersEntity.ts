import { UUID_TYPE } from 'src/utils/types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { file_storage } from './FileStoragerEntity';

@Entity()
export class users {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: false, unique: true, length: 20 })
  user_name: string;

  @Column({ nullable: false })
  user_password: string;

  @OneToOne(() => file_storage, (entity) => entity.file_id, { nullable: true })
  file_id: UUID_TYPE;
}
