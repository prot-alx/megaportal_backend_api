import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;
}
