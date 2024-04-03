import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'student-key-pair' })
export class StudentKeyPairEntity {
  @PrimaryGeneratedColumn({ name: 'pk' })
  pk: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'student_number' })
  studentNumber: string;

  @Column({ type: 'int', name: 'major_code' })
  major_code: number;
}
