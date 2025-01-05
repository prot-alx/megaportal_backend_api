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
import { Material } from '../material/material.entity';

@ObjectType()
@Entity('warehouse_filling')
export class WarehouseFilling {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Material)
  @ManyToOne(() => Material, { eager: true })
  @JoinColumn({ name: 'material_id' })
  material: Material;

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
