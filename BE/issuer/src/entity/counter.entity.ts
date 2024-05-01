import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'counter', schema: 'db' })
export class CounterEntity {
  @PrimaryColumn({ type: 'varchar', name: 'id', default: 'counter' })
  id: string;

  @Column({ type: 'int', name: 'count', default: 0 })
  count: number;
}
