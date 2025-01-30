import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { randomUUID } from 'crypto';
import { UUID_TYPE } from 'src/utils/types';

@Entity()
export class file_storage {
  @PrimaryColumn({ default: randomUUID() })
  file_id: UUID_TYPE;

  @Column({ nullable: false })
  file_src: string;

  @Column({ nullable: false, length: 30 })
  file_name: string;
}
