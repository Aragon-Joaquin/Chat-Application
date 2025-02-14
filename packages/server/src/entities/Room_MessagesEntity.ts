import { UUID_TYPE } from 'src/utils/types';
import { Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { users } from './UsersEntity';
import { room } from './RoomEntity';
import { messages } from './MessagesEntity';

export class room_messages {
  @PrimaryColumn({ nullable: false })
  @ManyToOne(() => users, (entity) => entity.user_id)
  sender_id: number;

  @PrimaryColumn({ nullable: false, length: 6 })
  @ManyToOne(() => room, (entity) => entity.room_id)
  which_room: string;

  @PrimaryColumn({ nullable: false })
  @ManyToOne(() => messages, (entity) => entity.message_id)
  message_id: UUID_TYPE;

  @Column({ nullable: false, default: Date.now() })
  date_sended: Date;
}
