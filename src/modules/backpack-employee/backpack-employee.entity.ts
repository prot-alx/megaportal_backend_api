import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
