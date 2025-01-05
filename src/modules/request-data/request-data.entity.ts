import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Requests } from '../request/requests.entity';
import { Employee } from '../employee/employee.entity';

@ObjectType() // Декоратор для GraphQL
@Entity('request_data')
export class RequestData {
  @Field(() => ID) // Указываем, что это ID поле для GraphQL
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Requests) // Указываем тип связи
  @ManyToOne(() => Requests)
  @JoinColumn({ name: 'request_id' })
  request: Requests;

  @Field(() => Employee)
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'executor_id' })
  executor_id: Employee;

  @Field(() => Employee)
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'performer_id' })
  performer_id: Employee;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}