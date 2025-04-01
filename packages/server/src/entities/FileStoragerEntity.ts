import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';
import { UUID_TYPE } from 'src/utils/types';

@Entity()
export class file_storage {
  @PrimaryColumn({ default: randomUUID(), type: 'varchar' })
  file_id: UUID_TYPE;

  @Column({ nullable: false, type: 'varchar' })
  file_src: string;

  @Column({ nullable: false, length: 128, type: 'varchar' })
  file_name: string;
}
