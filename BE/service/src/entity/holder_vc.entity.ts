import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'holder_vc' })
export class HolderVCEntity {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  did!: string;

  @Column({ type: 'varchar', length: 1024 })
  vc!: string;
}
