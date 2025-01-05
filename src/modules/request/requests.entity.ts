import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
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

export enum RequestStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
  MONITORING = 'MONITORING',
  POSTPONED = 'POSTPONED',
}
export enum RequestType {
  Default = 'Default',
  VIP = 'VIP',
  Video = 'Video',
  Optical = 'Optical',
  Other = 'Other',
}

// Регистрируем enum'ы для GraphQL
registerEnumType(RequestStatus, {
  name: 'RequestStatus',
});

registerEnumType(RequestType, {
  name: 'RequestType',
});

@ObjectType()
@Entity('request')
export class Requests {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Employee)
  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'hr_id' })
  hr_id: Employee;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ep_id: string;

  @Field()
  @Column({ nullable: false })
  client_id: string;

  @Field()
  @Column({ nullable: false })
  description: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  client_contacts: string;

  @Field()
  @Column({ nullable: false })
  address: string;

  @Field(() => Date)
  @Column({ type: 'date', nullable: false })
  request_date: Date;

  @Field(() => RequestType)
  @Column({
    type: 'enum',
    enum: RequestType,
    nullable: false,
    default: RequestType.Default,
  })
  type: RequestType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  comment: string;

  @Field(() => RequestStatus)
  @Column({
    type: 'enum',
    enum: RequestStatus,
    nullable: false,
    default: RequestStatus.NEW,
  })
  status: RequestStatus;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
