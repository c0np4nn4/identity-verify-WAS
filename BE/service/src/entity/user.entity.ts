import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { BoatEntity } from './boat.entity';

@Entity({ name: 'user', schema: 'db' })
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', name: 'pk' })
  pk: string;

  @Column({ type: 'varchar', name: 'nickname' })
  nickname: string;

  @Column({ type: 'varchar', name: 'id' })
  id: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({ type: 'boolean', name: 'is_verified_user', default: false })
  isVerifiedUser: boolean;

  @Column({ type: 'int', name: 'heart', default: 0 })
  heart: number;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  // fk

  @OneToOne(() => BoatEntity, (boat) => boat.user)
  boat: BoatEntity;
}
