import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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
  hr: Employee;

  @Column({ nullable: true, name: 'ep_id' })
  epId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'request_date' })
  requestDate: Date;

  @Column({ type: 'enum', enum: RequestType, nullable: true })
  type: RequestType;

  @Column({ nullable: true })
  comment: string;

  @Column({ type: 'enum', enum: RequestStatus, nullable: true })
  status: RequestStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}