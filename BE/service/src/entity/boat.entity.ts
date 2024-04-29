import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'boat', schema: 'db' })
export class BoatEntity {
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: number;

  // fk
  @Column({
    type: 'varchar',
    name: 'user_pk',
    nullable: false,
  })
  userPk: string;

  @Column({ type: 'varchar', name: 'label_1', nullable: true })
  label1: string;

  @Column({ type: 'varchar', name: 'label_2', nullable: true })
  label2: string;

  @Column({ type: 'varchar', name: 'label_3', nullable: true })
  label3: string;

  @Column({ type: 'varchar', name: 'label_4', nullable: true })
  label4: string;

  @Column({ type: 'varchar', name: 'label_5', nullable: true })
  label5: string;

  @Column({ type: 'varchar', name: 'label_6', nullable: true })
  label6: string;

  @Column({ type: 'varchar', name: 'label_7', nullable: true })
  label7: string;

  @Column({ type: 'varchar', name: 'label_8', nullable: true })
  label8: string;

  @Column({ type: 'varchar', name: 'label_9', nullable: true })
  label9: string;

  @Column({ type: 'varchar', name: 'label_10', nullable: true })
  label10: string;

  @Column({ type: 'varchar', name: 'secrete_1', nullable: true })
  secrete1: string;

  @Column({ type: 'varchar', name: 'secrete_2', nullable: true })
  secrete2: string;

  // @Column({ type: 'boolean', name: 'is_occupied', default: false })
  // isOccupied: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  // fk

  @OneToOne(() => UserEntity, { createForeignKeyConstraints: false })
  @JoinColumn({
    name: 'user_pk',
    referencedColumnName: 'pk',
  })
  user: UserEntity;
}
