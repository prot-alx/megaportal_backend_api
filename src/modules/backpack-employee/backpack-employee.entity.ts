import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { WarehouseFilling } from '../warehouse-filling/warehouse-filling.entity';

@Entity('backpack_employee')
export class BackpackEmployee {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => WarehouseFilling)
  @JoinColumn({ name: 'warehouse_filling_id' })
  warehouseFilling: WarehouseFilling;

  @Column()
  count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
