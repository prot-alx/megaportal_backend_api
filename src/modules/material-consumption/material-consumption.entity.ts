import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BackpackEmployee } from '../backpack-employee/backpack-employee.entity';
import { RequestData } from '../request-data/request-data.entity';

@Entity('material_consumption')
export class MaterialConsumption {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RequestData)
  @JoinColumn({ name: 'request_data_id' })
  requestData: RequestData;

  @ManyToOne(() => BackpackEmployee)
  @JoinColumn({ name: 'backpack_employee_id' })
  backpackEmployee: BackpackEmployee;

  @Column()
  count: number;

  @Column({ default: false })
  approved: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
