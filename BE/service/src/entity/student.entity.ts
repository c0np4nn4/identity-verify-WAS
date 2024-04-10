import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'student' })
export class StudentEntity {
  @PrimaryColumn({ type: 'varchar' })
  number: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  major_code: string;
}
