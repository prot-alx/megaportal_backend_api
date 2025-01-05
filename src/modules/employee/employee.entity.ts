import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EmployeeRole {
  Admin = 'Admin',
  Storekeeper = 'Storekeeper',
  Dispatcher = 'Dispatcher',
  Performer = 'Performer',
}

// Регистрируем enum для GraphQL
registerEnumType(EmployeeRole, {
  name: 'EmployeeRole',
});

@ObjectType()
@Entity('employee')
export class Employee {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  external_id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field()
  @Column({ nullable: false })
  login: string;

  // Не добавляем @Field() для password, чтобы скрыть его из GraphQL API
  @Column({ nullable: false })
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone: string;

  @Field(() => EmployeeRole)
  @Column({ type: 'enum', enum: EmployeeRole })
  role: EmployeeRole;

  @Field()
  @Column({ nullable: false })
  is_active: boolean;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
