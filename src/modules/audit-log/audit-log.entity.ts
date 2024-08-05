import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  action: string;

  @Column()
  table_name: string;

  @Column()
  record_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'action_time' })
  actionTime: Date;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;
}
