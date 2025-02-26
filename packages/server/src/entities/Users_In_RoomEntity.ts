import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { users } from './UsersEntity';
import { room } from './RoomEntity';
import { roles } from './RolesEntity';

@Entity({ comment: 'This is a many to many relationship' })
export class users_in_room {
  @PrimaryColumn({ nullable: false, type: 'int' })
  user_id: number;

  @PrimaryColumn({ length: 6, nullable: false, type: 'varchar' })
  room_id: string;

  @ManyToOne(() => roles, (entity) => entity.role_name, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role_id: roles;

  @ManyToOne(() => users, (entity) => entity.user_id)
  @JoinColumn({ name: 'user_id' })
  user: users;

  @ManyToOne(() => room, (entity) => entity.room_id)
  @JoinColumn({ name: 'room_id' })
  room: room;
}
