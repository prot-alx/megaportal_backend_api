import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EmployeeRole {
  Admin = 'Admin',
  Storekeeper = 'Storekeeper',
  Dispatcher = 'Dispatcher',
  Performer = 'Performer',
}

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'external_id' })
  externalId: string;

  @Column({ nullable: true })
  name: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: EmployeeRole, nullable: true })
  role: EmployeeRole;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
