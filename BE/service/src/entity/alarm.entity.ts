import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { MatchLogEntity } from './match-log.entity';

@Entity({ name: 'alarm', schema: 'db' })
export class AlarmEntity {
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  @Column({
    type: 'varchar',
    name: 'user_pk',
    nullable: false,
  })
  userPk: string;

  // fk
  @Column({
    type: 'int',
    name: 'match_log_pk',
    nullable: false,
  })
  matchLogPk: number;

  @Column({ type: 'varchar', name: 'text' })
  text: string;

  @Column({ type: 'boolean', name: 'read', default: false })
  read: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // fk

  @OneToOne(() => MatchLogEntity, { createForeignKeyConstraints: false })
  @JoinColumn({
    name: 'match_log_pk',
    referencedColumnName: 'pk',
  })
  matchLog: MatchLogEntity;
}
