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

@Entity('material')
@Unique(['category_id', 'type_id', 'subtype_id'])
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  sap_number?: string;

  @Column({ nullable: true })
  serial?: string;

  @Column({ nullable: true })
  inventory_number?: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => MaterialCategory, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category_id: MaterialCategory;

  @ManyToOne(() => MaterialType, { eager: true })
  @JoinColumn({ name: 'type_id' })
  type_id: MaterialType;

  @ManyToOne(() => MaterialSubtype, { eager: true })
  @JoinColumn({ name: 'subtype_id' })
  subtype_id: MaterialSubtype;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
