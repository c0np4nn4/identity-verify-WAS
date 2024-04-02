import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', name: 'pk' })
  pk: string;

  @Column({ type: 'varchar', name: 'nickname' })
  nickname: string;

  @Column({ type: 'varchar', name: 'id' })
  id: string;

  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Column({ type: 'int', name: 'major_code' })
  major_code: number;

  @Column({ type: 'boolean', name: 'is_verified_user', default: false })
  isVerifiedUser: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;
}
