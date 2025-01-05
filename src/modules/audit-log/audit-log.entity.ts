import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
@Entity('audit_log')
export class AuditLog {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Employee)
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Field()
  @Column()
  action: string;

  @Field()
  @Column()
  table_name: string;

  @Field()
  @Column()
  record_id: number;

  @Field(() => Date)
  @CreateDateColumn()
  action_time: Date;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;
}
