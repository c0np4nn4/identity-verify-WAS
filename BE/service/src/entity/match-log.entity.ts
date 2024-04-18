import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { AlarmEntity } from './alarm.entity';

@Entity({ name: 'match_log', schema: 'db' })
export class MatchLogEntity {
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Column({
    type: 'varchar',
    name: 'user_pk',
    nullable: false,
  })
  userPk: string;

  @Column({
    type: 'varchar',
    name: 'target_pk',
    nullable: false,
  })
  targetPk: string;

  @Column({ type: 'varchar', name: 'status' })
  status: string;

  @Column({ type: 'varchar', name: 'label_1' })
  label1: string;

  @Column({ type: 'varchar', name: 'label_2' })
  label2: string;

  @Column({ type: 'varchar', name: 'label_3' })
  label3: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'answer' })
  answer: string;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // fk

  @OneToOne(() => AlarmEntity, { createForeignKeyConstraints: false })
  matchLog: AlarmEntity;
}
