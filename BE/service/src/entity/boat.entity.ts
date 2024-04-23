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

  @Column({ type: 'varchar', name: 'label_1' })
  label1: string;

  @Column({ type: 'varchar', name: 'label_2' })
  label2: string;

  @Column({ type: 'varchar', name: 'label_3' })
  label3: string;

  @Column({ type: 'varchar', name: 'label_4' })
  label4: string;

  @Column({ type: 'varchar', name: 'label_5' })
  label5: string;

  @Column({ type: 'varchar', name: 'label_6' })
  label6: string;

  @Column({ type: 'varchar', name: 'label_7' })
  label7: string;

  @Column({ type: 'varchar', name: 'label_8' })
  label8: string;

  @Column({ type: 'varchar', name: 'label_9' })
  label9: string;

  @Column({ type: 'varchar', name: 'label_10' })
  label10: string;

  @Column({ type: 'varchar', name: 'secrete_1' })
  secrete1: string;

  @Column({ type: 'varchar', name: 'secrete_2' })
  secrete2: string;

  @Column({ type: 'boolean', name: 'is_occupied', default: false })
  isOccupied: boolean;

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
