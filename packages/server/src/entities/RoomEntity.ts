import { ROOM_CODE_TYPE, UUID_TYPE } from 'src/utils/types';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { hash } from 'node:crypto';
import { createDateNow } from 'src/utils/constants';
import { file_storage } from './FileStoragerEntity';

@Entity()
export class room {
  @PrimaryColumn({
    default: hash('md5', `${Math.random()}`, 'hex').slice(0, 6),
    nullable: false,
    unique: true,
    length: 6,
    type: 'varchar',
  })
  room_id: ROOM_CODE_TYPE;

  @Column({ length: 20, nullable: false, type: 'varchar' })
  room_name: string;

  @Column({ nullable: true, type: 'varchar' })
  room_password: string;

  @Column({ length: 150, nullable: true, type: 'varchar' })
  room_description: string;

  @Column({ nullable: false, default: createDateNow(), type: 'date' })
  created_at: Date;

  @OneToOne(() => file_storage, (entity) => entity.file_id, { nullable: true })
  room_picture: file_storage;
}
