import { randomUUID } from 'crypto';
import { UUID_TYPE } from 'src/utils/types';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { file_storage } from './FileStoragerEntity';

@Entity()
export class messages {
  @PrimaryColumn({ default: randomUUID() })
  message_id: UUID_TYPE;

  @Column({ nullable: true })
  message_content: string;

  @Column({ nullable: false, default: Date.now() })
  date_sended: Date;

  // for now it's only one file per message.
  // i have no idea how to do it, unless i make another table called Messages_Files.
  @Column()
  @OneToOne(() => file_storage, (entity) => entity.file_id, { nullable: true })
  file_id: UUID_TYPE;
}
