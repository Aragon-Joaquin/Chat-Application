import { UUID_TYPE } from 'src/utils/types';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { file_storage } from './FileStoragerEntity';

@Entity()
export class users {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  user_id: number;

  @Column({ nullable: false, unique: true, length: 20 })
  user_name: string;

  @Column({ nullable: false })
  user_password: string;

  @Column()
  @OneToOne(() => file_storage, (entity) => entity.file_id, { nullable: true })
  profile_picture: UUID_TYPE;
}
