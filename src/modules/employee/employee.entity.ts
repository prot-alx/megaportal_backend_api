import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
