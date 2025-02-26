import { UUID_TYPE } from 'src/utils/types';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { users } from './UsersEntity';
import { room } from './RoomEntity';
import { messages } from './MessagesEntity';

@Entity()
export class room_messages {
  @PrimaryColumn({ nullable: false, type: 'int' })
  sender_id: number;

  @PrimaryColumn({ nullable: false, length: 6, type: 'varchar' })
  which_room: string;

  @PrimaryColumn({ nullable: false, type: 'varchar' })
  message_id: UUID_TYPE;

  @Column({ nullable: false, default: Date.now() })
  date_sended: Date;

  @ManyToOne(() => users, (entity) => entity.user_id)
  @JoinColumn({ name: 'sender_id' })
  user: users;

  @ManyToOne(() => room, (entity) => entity.room_id)
  @JoinColumn({ name: 'which_room' })
  room: room;

  @ManyToOne(() => messages, (entity) => entity.message_id)
  @JoinColumn({ name: 'message_id' })
  message: messages;
}
