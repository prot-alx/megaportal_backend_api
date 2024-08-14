import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('baza')
export class OldBaza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  nid?: number;

  @Column({ type: 'timestamp', nullable: true })
  date?: Date;

  @Column({ type: 'bigint', nullable: true })
  tel?: number;

  @Column({ length: 40, nullable: true })
  usluga?: string;

  @Column('text', { nullable: true })
  zhaloba?: string;

  @Column({ length: 300, nullable: true })
  oborud?: string;

  @Column({ length: 100, nullable: true })
  adres?: string;

  @Column({ length: 30, nullable: true, default: '---' })
  kt?: string;

  @Column('text', { nullable: true })
  ispoln?: string;

  @Column('text', { nullable: true })
  viyavleno?: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  zakrytie?: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  otpisano?: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  vip?: number;

  @Column({ type: 'timestamp', nullable: true })
  datez?: Date;

  @Column({ type: 'timestamp', nullable: true })
  datep?: Date;

  @Column({ type: 'int', nullable: true, default: 0 })
  otl?: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  testmod?: number;

  @Column({ length: 100, nullable: true })
  port?: string;

  @Column({ length: 25, nullable: true })
  avtor?: string;

  @Column({ length: 100, nullable: true })
  porturez?: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  prinyal?: number;

  @Column({ type: 'int', nullable: true })
  proz?: number;

  @Column('text', { nullable: true })
  proztext?: string;
}
