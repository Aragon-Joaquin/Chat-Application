import { randomUUID } from 'crypto';
import { UUID_TYPE } from 'src/utils/types';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { file_storage } from './FileStoragerEntity';

@Entity()
export class messages {
  @PrimaryColumn({ default: randomUUID(), type: 'varchar' })
  message_id: UUID_TYPE;

  @Column({ nullable: true, type: 'varchar' })
  message_content: string;

  // for now it's only one file per message.
  // i have no idea how to do it, unless i make another table called Messages_Files.
  @OneToOne(() => file_storage, (entity) => entity.file_id, { nullable: true })
  file_id: file_storage;
}
