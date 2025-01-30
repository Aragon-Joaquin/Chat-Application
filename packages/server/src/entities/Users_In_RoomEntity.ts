import { Entity, Index, PrimaryColumn, Table } from 'typeorm';

@Entity({ comment: 'This is a many to many relationship' })
export class users_in_room {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  room_id: string;
  role_id: string;
}

//not finished.
