import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ETLState, ProcessStatus } from '@interfaces/etl.interface';

@Entity()
export class ETLStateEntity extends BaseEntity implements ETLState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ProcessStatus })
  status: ProcessStatus;

  @Column()
  batchId: string;

  @Column()
  etl: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}
