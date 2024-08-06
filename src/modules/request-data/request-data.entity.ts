import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Requests } from '../request/requests.entity';
import { Employee } from '../employee/employee.entity';

@Entity('request_data')
export class RequestData {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Requests)
  @JoinColumn({ name: 'request_id' })
  request: Requests;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'executor_id' })
  executor: Employee;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'performer_id' })
  performer: Employee;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
