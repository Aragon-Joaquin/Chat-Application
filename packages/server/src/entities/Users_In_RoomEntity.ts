import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { users } from './UsersEntity';
import { room } from './RoomEntity';
import { roles } from './RolesEntity';

@Entity({ comment: 'This is a many to many relationship' })
export class users_in_room {
  @PrimaryColumn({ nullable: false })
  @ManyToOne(() => users, (entity) => entity.user_id)
  user_id: number;

  @PrimaryColumn({ length: 6, nullable: false })
  @ManyToOne(() => room, (entity) => entity.room_id)
  room_id: string;

  @Column()
  @ManyToOne(() => roles, (entity) => entity.role_name, { nullable: false })
  role_id: string;
}
