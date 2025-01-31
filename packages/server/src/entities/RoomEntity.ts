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
  })
  room_id: ROOM_CODE_TYPE;

  @Column({ length: 20, nullable: false })
  room_name: string;

  @Column({ nullable: true })
  room_password: string;

  @Column({ length: 150, nullable: true })
  room_description: string;

  @Column({ nullable: false, default: createDateNow() })
  created_at: Date;

  @Column()
  @OneToOne(() => file_storage, (entity) => entity.file_id, { nullable: true })
  room_picture: UUID_TYPE;
}
