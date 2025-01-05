import { Field, ID, ObjectType } from '@nestjs/graphql';
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
import { WarehouseFilling } from '../warehouse-filling/warehouse-filling.entity';

@ObjectType()
@Entity('backpack_employee')
export class BackpackEmployee {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Employee)
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee_id: Employee;

  @Field(() => WarehouseFilling)
  @ManyToOne(() => WarehouseFilling)
  @JoinColumn({ name: 'warehouse_filling_id' })
  warehouse_filling_id: WarehouseFilling;

  @Field()
  @Column()
  count: number;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
