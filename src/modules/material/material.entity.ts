import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { MaterialCategory } from '../material-category/material-category.entity';
import { MaterialType } from '../material-type/material-type.entity';
import { MaterialSubtype } from '../material-subtype/material-subtype.entity';

@ObjectType()
@Entity('material')
@Unique(['category_id', 'type_id', 'subtype_id'])
export class Material {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  sap_number?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  serial?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  inventory_number?: string;

  @Field()
  @Column({ default: true })
  is_active: boolean;

  @Field(() => MaterialCategory)
  @ManyToOne(() => MaterialCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category_id: MaterialCategory;

  @Field(() => MaterialType)
  @ManyToOne(() => MaterialType, { eager: true })
  @JoinColumn({ name: 'type_id' })
  type_id: MaterialType;

  @Field(() => MaterialSubtype)
  @ManyToOne(() => MaterialSubtype, { eager: true })
  @JoinColumn({ name: 'subtype_id' })
  subtype_id: MaterialSubtype;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updated_at: Date;
}
