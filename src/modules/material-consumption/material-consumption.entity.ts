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
import { BackpackEmployee } from '../backpack-employee/backpack-employee.entity';
import { RequestData } from '../request-data/request-data.entity';

@ObjectType()
@Entity('material_consumption')
export class MaterialConsumption {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => RequestData)
  @ManyToOne(() => RequestData)
  @JoinColumn({ name: 'request_data_id' })
  requestData: RequestData;

  @Field(() => BackpackEmployee)
  @ManyToOne(() => BackpackEmployee)
  @JoinColumn({ name: 'backpack_employee_id' })
  backpackEmployee: BackpackEmployee;

  @Field()
  @Column()
  count: number;

  @Field()
  @Column({ default: false })
  approved: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
