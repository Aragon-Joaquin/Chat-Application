import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class roles {
  @PrimaryColumn({ length: 20, nullable: false, unique: true })
  role_name: string;

  @Column({ default: false, nullable: false, type: 'boolean' })
  delete_messages: boolean;

  @Column({ default: false, nullable: false, type: 'boolean' })
  remove_users: boolean;

  @Column({ default: true, nullable: false, type: 'boolean' })
  can_be_removed: boolean;
}
