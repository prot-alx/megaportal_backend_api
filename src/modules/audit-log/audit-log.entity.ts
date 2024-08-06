import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
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

  @CreateDateColumn()
  action_time: Date;
  
  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;
}
