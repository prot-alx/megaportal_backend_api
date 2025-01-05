import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

export enum RequestStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
  MONITORING = 'MONITORING',
  POSTPONED = 'POSTPONED',
}

export enum RequestType {
  Default = 'Default',
  VIP = 'VIP',
  Video = 'Video',
  Optical = 'Optical',
  Other = 'Other',
}

@Entity('request')
export class Requests {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'hr_id' })
  hr_id: Employee;

  @Column({ nullable: true })
  ep_id: string;

  @Column({ nullable: false })
  client_id: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: true })
  client_contacts: string;

  @Column({ nullable: false })
  address: string;

  @Column({ type: 'date', nullable: false })
  request_date: Date;

  @Column({
    type: 'enum',
    enum: RequestType,
    nullable: false,
    default: RequestType.Default,
  })
  type: RequestType;

  @Column({ nullable: true })
  comment: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    nullable: false,
    default: RequestStatus.NEW,
  })
  status: RequestStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
