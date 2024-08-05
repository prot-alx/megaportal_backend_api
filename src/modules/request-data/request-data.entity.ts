import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
