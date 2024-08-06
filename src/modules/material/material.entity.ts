import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MaterialCategory } from '../material-category/material-category.entity';
import { MaterialSubtype } from '../material-subtype/material-subtype.entity';
import { MaterialType } from '../material-type/material-type.entity';

@Entity('material')
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MaterialCategory)
  @JoinColumn({ name: 'category_id' })
  category: MaterialCategory;

  @ManyToOne(() => MaterialType)
  @JoinColumn({ name: 'type_id' })
  type: MaterialType;

  @ManyToOne(() => MaterialSubtype)
  @JoinColumn({ name: 'subtype_id' })
  subtype: MaterialSubtype;

  @Column({ nullable: true, name: 'sap_number' })
  sapNumber: string;

  @Column({ nullable: true })
  serial: string;

  @Column({ nullable: true, name: 'inventory_number' })
  inventoryNumber: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
